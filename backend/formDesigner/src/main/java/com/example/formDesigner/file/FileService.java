package com.example.formDesigner.file;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.formDesigner.cipher.CipherClass;

@Service
public class FileService {
	
	private final FileRepository fileRepository;
	
	@Autowired
	public FileService(FileRepository fileRepository) {
		this.fileRepository = fileRepository;
	}
	
	public ResponseEntity<FileSystemResource> getFileById(String fileId) {
		try {
			File file = fileRepository.findById(Long.parseLong(fileId)).get();
			String fileName = file.getName();
			String pathStr = "uploads/" + fileName;
			Path path = Paths.get(pathStr);
			java.io.File f = path.toFile();
			HttpHeaders headers = new HttpHeaders();
	        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
	        headers.setContentDispositionFormData("attachment", f.getName());
			FileSystemResource resource = new FileSystemResource(f);
			return ResponseEntity.ok()
					.headers(headers)
	                .contentLength(f.length())
	                .body(resource);
		}catch(Exception e) {
			e.printStackTrace();
			return null;
		}	
	}
	
	public JSONObject decryptHash(String hash) {
		CipherClass cipherClass = new CipherClass();
		String decrypted = cipherClass.decrypt(hash.replaceAll("\\.", "/"));
	    JSONObject jsonObject = (JSONObject) JSONValue.parse(decrypted);
	    return jsonObject;
	}
	
	public JSONObject uploadFile(MultipartFile file) {
		JSONObject response = new JSONObject();
		try {
			Files.createDirectories(Paths.get("uploads"));
			Path path = Paths.get("uploads/" + file.getOriginalFilename());
			file.transferTo(path);
			SimpleDateFormat formatter= new SimpleDateFormat("dd-MM-yyyy HH:mm:ss z");
			Date date = new Date(System.currentTimeMillis());
			String currentDate = formatter.format(date);
			File f = new File(file.getSize(), file.getOriginalFilename(), currentDate);
			File savedFile = fileRepository.save(f);
			JSONObject responseData = new JSONObject();
			CipherClass cipherClass = new CipherClass();
			responseData.put("id", savedFile.getId());
			String hash = cipherClass.encrypt(responseData.toString());
			response.put("status", 1);
			response.put("data", hash);
			return response;
		} catch (Exception e) {
			e.printStackTrace();
			response.put("status", 0);
			return response;
		}
	}

}
