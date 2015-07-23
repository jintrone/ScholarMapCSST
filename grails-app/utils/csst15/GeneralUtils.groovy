package csst15

import csst15.constants.EntityType
import csst15.security.User
import org.apache.commons.lang3.text.WordUtils
import org.codehaus.groovy.grails.web.mapping.LinkGenerator
import org.springframework.beans.factory.annotation.Autowired

import java.security.MessageDigest
import java.text.Normalizer

import static csst15.constants.EntityType.*

/**
 * Created by Emil Matevosyan
 * Date: 2/24/15.
 */

public final class GeneralUtils {
    private static final String LOCKED_SUFFIX = 'Locked'
    private static final String MANDATORY_SUFFIX = 'Mandatory'
    private static final String VISIBLE_SUFFIX = 'Visible'
    private static final String PREFIX = 'is'





    private GeneralUtils() {
    }

    public static String constructFieldForLock(String fieldName) {
        return PREFIX.concat(WordUtils.capitalize(fieldName)).concat(LOCKED_SUFFIX)
    }

    public static String constructMandatoryField(String fieldName) {
        return PREFIX.concat(WordUtils.capitalize(fieldName)).concat(MANDATORY_SUFFIX)
    }

    public static String constructVisibleField(String fieldName) {
        return PREFIX.concat(WordUtils.capitalize(fieldName)).concat(VISIBLE_SUFFIX)
    }

    public static String constructReferenceUrl(String prefix,User u) {
        def refUrl = Normalizer.normalize(u.username?.toLowerCase(), Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .replaceAll("[^\\p{Alnum}]+", "-")
                .replace("--", "-").replace("--", "-")
                .replaceAll('[^a-z0-9]+$', "")
                .replaceAll("^[^a-z0-9]+", "")

        "${prefix}/user/${refUrl}"
    }

    public static String createUsername(String first, String last, String email) {
        String result
        if (first || last) {
           result = "${first.toLowerCase()}_${last.toLowerCase()}"
       } else  {
           result = email.split("@")[0].toLowerCase()
       }
       List<User> users = User.findAllByUsername(result)


        if (users) {
            result+=(users.collect {u->(u.username.find(/\d+$/)?:"0").toInteger()}.max()+1) as String
        }
        result
    }




    public static String constructReferenceUrl(String prefix, Entity e) {
//        def refUrl = Normalizer.normalize(source?.toLowerCase(), Normalizer.Form.NFD)
//                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
//                .replaceAll("[^\\p{Alnum}]+", "-")
//                .replace("--", "-").replace("--", "-")
//                .replaceAll('[^a-z0-9]+$', "")
//                .replaceAll("^[^a-z0-9]+", "")
//
        "${prefix}/entity/view/${e.id}"
    }

    public static String constructReferenceUrl(String prefix, Reference e) {
//        def refUrl = Normalizer.normalize(source?.toLowerCase(), Normalizer.Form.NFD)
//                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
//                .replaceAll("[^\\p{Alnum}]+", "-")
//                .replace("--", "-").replace("--", "-")
//                .replaceAll('[^a-z0-9]+$', "")
//                .replaceAll("^[^a-z0-9]+", "")
//
        "${prefix}/reference/view/${e.id}"
    }

    public static constructOnlyParam(EntityType entityType) {
        def result = null
        switch (entityType) {
            case csst15.constants.EntityType.METHOD:
                result = "methods"
                break
            case csst15.constants.EntityType.FIELD:
                result = "fields"
                break
            case csst15.constants.EntityType.VENUE:
                result = "venues"
                break
            case csst15.constants.EntityType.THEORY:
                result = "theories"
                break
        }

        return result
    }

    public static constructEntityType(String input) {
        def type
        switch (input) {
            case "Method":
                type = csst15.constants.EntityType.METHOD
                break
            case "Area":
                type = csst15.constants.EntityType.FIELD
                break
            case "Theory":
                type = csst15.constants.EntityType.THEORY
                break
            case "Venue":
                type = csst15.constants.EntityType.VENUE
                break
            default:
                return null
        }

        return type
    }

    public static String generateMD5(String s) {
        MessageDigest digest = MessageDigest.getInstance("MD5")
        digest.update(s.bytes);
        new BigInteger(1, digest.digest()).toString(16).padLeft(32, '0').toString()
    }
}
