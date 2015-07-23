package csst15.command

import csst15.conf.FieldMandatoryConf
import grails.validation.Validateable
import org.joda.time.LocalDate

/**
 * Created by Emil Matevosyan
 * Date: 2/28/15.
 */

@Validateable
class UpdateUserCommand {
    String username
    String email
    String firstName
    String lastName
    Integer degreeYear
    //String institution
    //String specialization
    String position
    //String department
    String schoolOrDepartment
    String currentInstitution
    String degreeInstitution

    byte[] photo

    static constraints = {
        username blank: false, unique: true
        email nullable: false, blank: false, unique: true, email: true

        firstName nullable: true, validator: { val, obj ->
            FieldMandatoryConf.withNewSession { session ->
                if (FieldMandatoryConf.findByFieldName('firstName')?.isMandatory && !val) {
                    return ['firstName.required']
                }
            }
        }
        lastName nullable: true, validator: { val, obj ->
            FieldMandatoryConf.withNewSession { session ->
                if (FieldMandatoryConf.findByFieldName('lastName')?.isMandatory && !val)
                    return ['lastName.required']
            }
        }
        currentInstitution nullable: true, validator: { val, obj ->
            FieldMandatoryConf.withNewSession { session ->
                if (FieldMandatoryConf.findByFieldName('currentInstitution')?.isMandatory && !val)
                    return ['currentInstitution.required']
            }
        }

       degreeInstitution nullable: true, validator: { val, obj ->
            FieldMandatoryConf.withNewSession { session ->
                if (FieldMandatoryConf.findByFieldName('degreeInstitution')?.isMandatory && !val)
                    return ['degreeInstitution.required']
            }
        }


//        degreeInstitution nullable: true
//        currentInstitution nullable: true
//        schoolOrDepartment nullable: true


//        specialization nullable: true, validator: { val, obj ->
//            FieldMandatoryConf.withNewSession { session ->
//                if (FieldMandatoryConf.findByFieldName('specialization')?.isMandatory && !val)
//                    return ['specialization.required']
//            }
//        }
        position nullable: true, validator: { val, obj ->
            FieldMandatoryConf.withNewSession { session ->
                if (FieldMandatoryConf.findByFieldName('position')?.isMandatory && !val)
                    return ['position.required']
            }
        }

        schoolOrDepartment nullable: true, validator: { val, obj ->
            FieldMandatoryConf.withNewSession { session ->
                if (FieldMandatoryConf.findByFieldName('schoolOrDepartment')?.isMandatory && !val)
                    return ['schoolOrDepartment.required']
            }
        }



//        department nullable: true, validator: { val, obj ->
//            FieldMandatoryConf.withNewSession { session ->
//                if (FieldMandatoryConf.findByFieldName('department')?.isMandatory && !val)
//                    return ['department.required']
//            }
//        }
        degreeYear nullable: true, max: LocalDate.now().year, validator: { val, obj ->
            FieldMandatoryConf.withNewSession { session ->
                if (FieldMandatoryConf.findByFieldName('degreeYear')?.isMandatory && !val)
                    return ['degreeYear.required']
            }
        }
        photo nullable: true
    }
}
