package fr.ece.neolog;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.KeyValue;
import org.apache.hadoop.hbase.client.Get;
import org.apache.hadoop.hbase.client.HTable;
import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.util.Bytes;


public class Dictionnary extends HTable{
	public Dictionnary(Configuration conf, String str) throws IOException{
		super(conf,str);
	}
	
	public void addNeologism(String word){
		byte[] rowKey = word.getBytes();
		List<Put> ap = new ArrayList<Put>();
		Put p = new Put(rowKey);
		p.add(c.infos,c.type,c.neologism);
		ap.add(p);
		p = new Put(rowKey);
		p.add(c.infos,c.track,c.yes);
		ap.add(p);
		try {
			this.put(ap);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public boolean isInDictionnary(String word) throws IOException{
		return this.exists(new Get(word.getBytes()));
	}
	
	public void addTrack(String word, String pseudo,String type, String age, String location, String timestamp) throws IOException{
		Put p = new Put(Bytes.toBytes(word));
		p.add(c.track, Bytes.toBytes(pseudo+':'+timestamp), Bytes.toBytes(type+':'+age+':'+location));
		this.put(p);
	}
	
	public boolean isTracked(String word) throws IOException{
		KeyValue kv =this.get(new Get(word.getBytes())).getColumnLatest(c.infos, c.track);
		if(kv!=null){
			if(kv.getValue()==c.yes){
				return true;
			}
		}
		return false;
	}
}