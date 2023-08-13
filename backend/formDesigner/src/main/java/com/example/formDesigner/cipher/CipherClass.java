package com.example.formDesigner.cipher;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

public class CipherClass {
	private final String key = "formDesigner4321";
	private Cipher cipher;
	private SecretKeySpec secretKeySpec;

	public CipherClass(){
		try {
			secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "AES");
			cipher = Cipher.getInstance("AES");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public String encrypt(String input) {
		try {
			cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
	        byte[] encryptedBytes = cipher.doFinal(input.getBytes(StandardCharsets.UTF_8));
	        return Base64.getEncoder().encodeToString(encryptedBytes);
		}catch(Exception e) {
			e.printStackTrace();
			return "";
		}
		
	}
	
	public String decrypt(String input) {
		try {
			cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);
			 byte[] decodedBytes = Base64.getDecoder().decode(input);
		     byte[] decryptedBytes = cipher.doFinal(decodedBytes);
		     return new String(decryptedBytes, StandardCharsets.UTF_8);
		}catch(Exception e) {
			e.printStackTrace();
			return "";
		}
	}
	
	//not used
	public String addPadding(String input) {
		String result = input;
		int length = input.length();
		if(length%16!=0) {
			int temp = length % 16;
			int diff = 16 - temp;
			for (int i = 0; i < diff; i++) {
				result += "0";
			}
		}
		return result;	
	}
}
