package csst15.conf

import csst15.security.User

class FieldVisibilityConf {
    User user
    Boolean isUsernameVisible = true
    Boolean isFirstNameVisible = true
    Boolean isLastNameVisible = true
    Boolean isEmailVisible = true
   // Boolean isDegreeYearVisible = true
   // Boolean isDegreeInstitutionVisible = true
    //Boolean isSpecializationVisible = true
    //Boolean isCurrentInstitutionVisible = true
    //Boolean isSchoolOrDepartmentVisible = true
    Boolean isPositionVisible = true

    Boolean isDepartmentVisible = true
    Boolean isPhotoVisible = true

    static constraints = {
    }

    static mapping = {
        version false
    }
}
