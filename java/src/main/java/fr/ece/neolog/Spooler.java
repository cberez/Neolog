package fr.ece.neolog;

import java.io.IOException;
import java.io.StringReader;
import java.util.StringTokenizer;
import javax.json.Json;
import javax.json.JsonObject;
import org.apache.hadoop.conf.*;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;


public class Spooler {
	/**
	 * @param args : arg[0] = input file
	 */
	
	private static Dictionnary dico = null;
	public static void main(String[] args) {
		Path input = new Path((args.length>1) ? args[1] : "input");
		Configuration conf = new Configuration();
		Configuration hConf = HBaseConfiguration.create();
		try {
			dico = new Dictionnary(hConf,(args.length>0) ? args[0] : "dictionnary");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			System.out.println("la table '"+((args.length>0) ? args[0] : "dictionnary")+"' n'existe pas, vérifier la conf Zookeeper et Hbase, et vérifier si HBase est exécuté");
		}
		System.out.println("*** Creating Job");
		Job job;
		try {
			job = new Job(conf, "neolog");
			job.setMapperClass(Map.class);
	 		job.setJarByClass(Spooler.class);
	 		//On a pas besoin de la clé de sortie, donc on met null
		 	job.setOutputKeyClass(NullWritable.class);
			job.setOutputValueClass(Text.class);
	 		job.setNumReduceTasks(0);
			job.setInputFormatClass(WholeTextInputFormat.class);
			job.setOutputFormatClass(TextOutputFormat.class);
			FileInputFormat.addInputPath(job, input);
			FileOutputFormat.setOutputPath(job, new Path("output/"+System.currentTimeMillis()));
			try {
				job.waitForCompletion(true);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println("Impossible de créer un Job ! Probleme hadoop ou de parametre");
			e.printStackTrace();
		}
		try {
			FileSystem.get(conf).delete(input, true);
		}
		catch(IOException ex) {
			System.out.println(ex.getMessage());
		}
	}
	
	public static class Map extends Mapper<NullWritable, Text, NullWritable, Text> {
		public void map(NullWritable key, Text value, Context context) throws IOException, InterruptedException {
			JsonObject json = Json.createReader(new StringReader(value.toString())).readObject();
			StringTokenizer text = new StringTokenizer(json.getString("text"));
			while(text.hasMoreTokens()){
				String word = text.nextToken().toLowerCase();
				if(dico.isInDictionnary(word)){	
					System.out.println(word+" is known");
					if(dico.isTracked(word)){
						System.out.println(word+" is tracked");
						//dico.addTrack(word, json.getString("type"), json.getString("age"), json.getString("location"), json.getString("timestamp"));
					}
				}
				else{
					System.out.println(word+" is not known");
					//dico.addNeologism(word);
					//dico.addTrack(word, json.getString("type"), json.getString("age"), json.getString("location"), json.getString("timestamp"));
				}
			}
		}
	}
	
}
