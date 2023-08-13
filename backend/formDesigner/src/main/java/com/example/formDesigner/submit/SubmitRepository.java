package com.example.formDesigner.submit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubmitRepository extends JpaRepository<Submit, Long>{

}
