package csst15.command

import csst15.conf.FieldMandatoryConf
import grails.validation.Validateable
import org.joda.time.LocalDate

/**
 * Created by Emil Matevosyan
 * Date: 3/10/15.
 */

@Validateable
class RequiredFieldsCommand {
    String firstName
    String lastName
    //Integer degreeYear
//    String degreeInstitution
//    String currentInstitution
    //String specialization
    String position
    String department
   // String schoolOrDepartment

    static constraints = {
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
//        currentInstitution nullable: true, validator: { val, obj ->
//            FieldMandatoryConf.withNewSession { session ->
//                if (FieldMandatoryConf.findByFieldName('currentInstitution')?.isMandatory && !val)
//                    return ['currentInstitution.required']
//            }
//        }
//
//        degreeInstitution nullable: true, validator: { val, obj ->
//            FieldMandatoryConf.withNewSession { session ->
//                if (FieldMandatoryConf.findByFieldName('degreeInstitution')?.isMandatory && !val)
//                    return ['degreeInstitution.required']
//            }
//        }
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

        department nullable: true, validator: { val, obj ->
            FieldMandatoryConf.withNewSession { session ->
                if (FieldMandatoryConf.findByFieldName('department')?.isMandatory && !val)
                    return ['department.required']
            }
        }


//        schoolOrDepartment nullable: true, validator: { val, obj ->
//            FieldMandatoryConf.withNewSession { session ->
//                if (FieldMandatoryConf.findByFieldName('schoolOrDepartment')?.isMandatory && !val)
//                    return ['schoolOrDepartment.required']
//            }
//        }
//        degreeYear nullable: true, max: LocalDate.now().year, validator: { val, obj ->
//            FieldMandatoryConf.withNewSession { session ->
//                if (FieldMandatoryConf.findByFieldName('degreeYear')?.isMandatory && !val)
//                    return ['degreeYear.required']
//            }
//        }
    }
}
