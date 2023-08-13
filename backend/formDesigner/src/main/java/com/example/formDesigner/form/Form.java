package com.example.formDesigner.form;
import java.time.LocalDateTime;
import java.util.Date;

import jakarta.persistence.*;
import org.json.simple.JSONObject;

@Entity
@Table(name="form")
public class Form {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	private String name;

	@Column(length = 100000)
	private String formData;

	private String formLink;
	private LocalDateTime formEndDate;
	private String formPassword;
	private String viewSubmitsPassword;
	
	public Form() {}
	
	public Form(String name, String formData, LocalDateTime formEndDate, String formPassword){
		this.name = name;
		this.formData = formData;
		this.formEndDate = formEndDate;
		this.formPassword = formPassword;
	}
	
	public Form(Long id, String name, String formData, String formLink, LocalDateTime formEndDate, String formPassword, String viewSubmitsPassword){
		this.id = id;
		this.name = name;
		this.formData = formData;
		this.formLink = formLink;
		this.formEndDate = formEndDate;
		this.formPassword = formPassword;
		this.viewSubmitsPassword = viewSubmitsPassword;
	}
	
	public Form(String name, String formData, String formLink, LocalDateTime formEndDate, String formPassword, String viewSubmitsPassword){
		this.name = name;
		this.formData = formData;
		this.formLink = formLink;
		this.formEndDate = formEndDate;
		this.formPassword = formPassword;
		this.viewSubmitsPassword = viewSubmitsPassword;
	}

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getFormData() {
		return formData;
	}
	public void setFormData(String formData) {
		this.formData = formData;
	}
	public String getFormLink() {
		return formLink;
	}
	public void setFormLink(String formLink) {
		this.formLink = formLink;
	}
	public LocalDateTime getFormEndDate() {
		return formEndDate;
	}
	public void setFormEndDate(LocalDateTime formEndDate) {
		this.formEndDate = formEndDate;
	}
	public String getFormPassword() {
		return formPassword;
	}
	public void setFormPassword(String formPassword) {
		this.formPassword = formPassword;
	}
	public String getViewSubmitsPassword() {
		return viewSubmitsPassword;
	}
	public void setViewSubmitsPassword(String viewSubmitsPassword) {
		this.viewSubmitsPassword = viewSubmitsPassword;
	}
}
