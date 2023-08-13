package com.example.formDesigner.submit;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name="submit")
public class Submit {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	private Long formId;

	@Column(length = 100000)
	private String submitData;

	private String submitDate;

	public Submit() {}
	
	public Submit(Long formId, String submitData, String submitDate){
		this.formId = formId;
		this.submitData = submitData;
		this.submitDate = submitDate;
	}
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getFormId() {
		return formId;
	}
	public void setFormId(Long formId) {
		this.formId = formId;
	}
	public String getSubmitData() {
		return submitData;
	}
	public void setSubmitData(String submitData) {
		this.submitData = submitData;
	}
	public String getSubmitDate() {
		return submitDate;
	}
	public void setSubmitDate(String submitDate) {
		this.submitDate = submitDate;
	}
}
