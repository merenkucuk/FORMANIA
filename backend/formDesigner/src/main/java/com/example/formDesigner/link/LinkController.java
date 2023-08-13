package com.example.formDesigner.link;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/v1/link")
public class LinkController {
	
	private final LinkService linkservice;
	
	@Autowired
	public LinkController(LinkService linkservice) {
		this.linkservice = linkservice;
	}
	
	@GetMapping("/{key}")
	@ResponseBody
	public JSONObject getLinkByKey(@PathVariable String key) {
		try {
			return linkservice.getLink(key);
		}catch(Exception e) {
			e.printStackTrace();
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("message", "no such link.");
			return jsonObject;
		}
	}
	
	@PostMapping
	public JSONObject saveLink(@RequestBody String body) {
		JSONParser parser = new JSONParser();
		JSONObject response = null;
		try {
			JSONObject jsonObject = (JSONObject) parser.parse(body);
			Link link = new Link(jsonObject.get("value").toString());
			response = linkservice.saveLink(link);
			return response;
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return response;
		}	
	}
}
