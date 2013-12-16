package fr.ece.neolog;

import java.io.IOException;
import java.util.StringTokenizer;

import org.apache.hadoop.conf.*;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.MasterNotRunningException;
import org.apache.hadoop.hbase.ZooKeeperConnectionException;
import org.apache.hadoop.hbase.client.Get;
import org.apache.hadoop.hbase.client.HBaseAdmin;
import org.apache.hadoop.hbase.client.HTable;
import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.client.Result;
import org.apache.hadoop.hbase.util.Bytes;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
import org.jsoup.Jsoup;


public class Spooler {
	/**
	 * @param args : arg[0] = input file
	 */
	private static HTable dico = null;
	private static HTable tracks = null;
	public static void main(String[] args) {
		Path input = new Path((args.length>1) ? args[1] : "input");
		Configuration conf = new Configuration();
		Configuration hConf = HBaseConfiguration.create();
		
		try {
			HBaseAdmin hbase = new HBaseAdmin(conf);
		} catch (MasterNotRunningException | ZooKeeperConnectionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			System.out.println("Zookeeper et/ou HBase ne sont pas exécutés sur la machine");
		}
		try {
			dico = new HTable(hConf,(args.length>0) ? args[0] : "dictionnary");
			tracks = new HTable(hConf,"tracks");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			System.out.println("la table '"+((args.length>0) ? args[0] : "dictionnary")+"' n'existe pas");
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
			job.setInputFormatClass(TextInputFormat.class);
			job.setOutputFormatClass(TextOutputFormat.class);
			FileInputFormat.addInputPath(job, input);
			FileOutputFormat.setOutputPath(job, new Path("output/"+System.currentTimeMillis()));
			try {
				job.waitForCompletion(true);
			} catch (ClassNotFoundException | InterruptedException e) {
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
	
	public static class Map extends Mapper<LongWritable, Text, Text, NullWritable> {
	
		public void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
			StringTokenizer text = new StringTokenizer(Jsoup.parse(value.toString()).select("body").text());
			while(text.hasMoreTokens()){
				checkHBaseTokenList(text.nextToken());
			}
		}
		private void checkHBaseTokenList(String str){
			byte[] rowKey = Bytes.toBytes(str);
			Get row = new Get(rowKey);
			try {
				Result rs = dico.get(row);
				//Si le resultat existe
				if(!rs.isEmpty()){
					System.out.println("OUAOU");
				}
				else{
					System.out.println("creating in table:"+str);
					Put p = new Put(rowKey);
					p.add(Bytes.toBytes("infos"), Bytes.toBytes("type"), Bytes.toBytes("n"));
					p.add(Bytes.toBytes("infos"), Bytes.toBytes("track"), Bytes.toBytes("y"));
					p.add(Bytes.toBytes("infos"), Bytes.toBytes("counter"), Bytes.toBytes(1));
					dico.put(p);
				}
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
}
