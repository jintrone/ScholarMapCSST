package csst15.auth

import csst15.constants.Roles
import csst15.security.User
import grails.plugin.springsecurity.SpringSecurityUtils
import grails.plugin.springsecurity.userdetails.GrailsUser
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler

import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

/**
 * Created by Emil Matevosyan
 * Date: 2/25/15.
 */
class CustomAuthSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {
    @Override
    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response) {
        boolean hasAdmin = SpringSecurityUtils.ifAllGranted(Roles.ADMIN.name)
        boolean hasUser = SpringSecurityUtils.ifAllGranted(Roles.USER.name)

        if (hasAdmin) {
            return adminUrl
        } else if (hasUser) {
            GrailsUser user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            println "${user.getUsername()}"
            return "/user/${user.getUsername()}"
        } else {
            return super.determineTargetUrl(request, response)
        }
    }

    private String userUrl
    private String adminUrl

    void setUserUrl(String userUrl) {
        this.userUrl = userUrl
    }

    void setAdminUrl(String adminUrl) {
        this.adminUrl = adminUrl
    }
}
