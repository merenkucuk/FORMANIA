package com.example.formDesigner.file;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(path = "api/v1/file")
public class FileController {
	private final FileService fileService;
	
	@Autowired
	public FileController(FileService fileService) {
		this.fileService = fileService;
	}
	
	@GetMapping("/{fileId}")
	@ResponseBody
	public ResponseEntity<FileSystemResource> getFileById(@PathVariable String fileId) {
		try {
			return fileService.getFileById(fileId);
		}catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	@GetMapping("/decrypt/{hash}")
	@ResponseBody
	public JSONObject decryptHash(@PathVariable String hash) {
		JSONObject response = new JSONObject();
		try {
			response = fileService.decryptHash(hash);
			return response;
		}catch(Exception e) {
			e.printStackTrace();
			response.put("message", "error in decrypting.");
			return response;
		}
	}
	
	@PostMapping
	public JSONObject uploadFile(@RequestBody MultipartFile file) {
		JSONObject response = new JSONObject();
		response = fileService.uploadFile(file);
		return response;
	}

}
