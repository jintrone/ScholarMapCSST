package csst15

import com.google.common.base.Joiner
import csst15.constants.Roles
import csst15.security.Role
import csst15.security.User
import csst15.security.UserRole
import grails.rest.RestfulController
import groovy.json.JsonBuilder
import org.codehaus.groovy.grails.web.mapping.LinkGenerator

import static csst15.GeneralUtils.constructOnlyParam
import static csst15.GeneralUtils.constructReferenceUrl
import static csst15.constants.EntityType.*

class GraphController extends RestfulController {
    static responseFormats = ['json', 'xml']

    LinkGenerator grailsLinkGenerator

    GraphController() {
        super(User)
    }

    def charGraph() {
        def entityList = null
        if (params.only)
            entityList = params.only.tokenize(',')



        def entities = Entity.list()
        def references = Reference.list()
        def users = UserRole.findAllByRole(Role.findByAuthority(Roles.USER.name))*.user.unique()

        def builder = new JsonBuilder()
        def root = builder {
            nodes(
                    entities.collect { Entity entity ->
                        if (!entityList || (entityList && csst15.GeneralUtils.constructOnlyParam(entity.type) in entityList)) {
                            [
                                    name        : entity.name,
                                    type: entity.type.name,
                                    relative_url: csst15.GeneralUtils.constructReferenceUrl(grailsLinkGenerator.contextPath,entity),
                                    people      : UserEntity.findAllByEntity(entity).user.unique().id,
                                    references  :
                                            ReferenceVote.findAllByEntity(entity).reference.unique().collect {
                                                [id: it.id, weight: ReferenceVote.countByReference(it)]
                                            }
                            ]
                        }
                    }
            )


            attributes(
                    people:
                            users.collect { u ->
                                [
                                        id          : u.id,
                                        name        : u.firstName + " " + u.lastName,
                                        relative_url: csst15.GeneralUtils.constructReferenceUrl(grailsLinkGenerator.contextPath,u)
                                ]
                            },
                    references:
                            references.collect { Reference reference ->
                                String name = ReferenceAuthor.findAllByReference(reference).min { ReferenceAuthor a->
                                    a.authorOrder
                                }.author.lastName
                                def citationStr = "${name} ${reference.year}"
                                [id: reference.id, citationShort: citationStr, name: reference.citation, relative_url: csst15.GeneralUtils.constructReferenceUrl(grailsLinkGenerator.contextPath,reference)]
                            }
            )
        }

        render(builder.toPrettyString())
    }

    def refGraph() {
        def referencesAuthor = ReferenceAuthor.findAll()
        def referencesVote = ReferenceVote.findAll()
        def allMethods = Entity.findAllByType(csst15.constants.EntityType.METHOD)
        def allTheories = Entity.findAllByType(csst15.constants.EntityType.THEORY)
        def allVenues = Entity.findAllByType(csst15.constants.EntityType.VENUE)
        def allFields = Entity.findAllByType(csst15.constants.EntityType.FIELD)
        def users = UserRole.findAllByRole(Role.findByAuthority(Roles.USER.name))*.user.unique()

        def builder = new JsonBuilder()
        def root = builder {
            nodes(
                    referencesAuthor.reference.unique().collect { Reference reference ->
                        def authors = referencesAuthor.findAll { ReferenceAuthor refAuth -> refAuth.reference == reference }.author
                        def authorStr = Joiner.on(",").join(authors.lastName)
                        def citationStr = "${authors.first().lastName} ${reference.year}"
                        def entities = referencesVote.findAll { ReferenceVote refVote -> refVote.reference == reference }.entity
                        def methods = entities.findAll { Entity method -> method.type == csst15.constants.EntityType.METHOD }.unique()
                        def theories = entities.findAll { Entity theory -> theory.type == csst15.constants.EntityType.THEORY }.unique()
                        def fields = entities.findAll { Entity field -> field.type == csst15.constants.EntityType.FIELD }.unique()
                        def venues = entities.findAll { Entity venue -> venue.type == csst15.constants.EntityType.VENUE }.unique()
                        [
                                citation    : reference.citation,
                                year        : reference.year,
                                authors: authorStr,
                                citationShort : citationStr,
                                //institution  : reference.creator?.currentInstitution?: "",
                                relative_url: csst15.GeneralUtils.constructReferenceUrl(grailsLinkGenerator.contextPath,reference),
                                methods     : (methods.id),
                                fields      : (fields.id),
                                venues      : (venues.id),
                                theories    : (theories.id)
                        ]
                    }
            )

            attributes {
                "methods" {
                    allMethods.collect { method ->
                        "${method.id}" {
                            name "${method.name}"
                            relative_url "${csst15.GeneralUtils.constructReferenceUrl(grailsLinkGenerator.contextPath,method)}"
                        }
                    }
                }

                "theories" {
                    allTheories.collect { theory ->
                        "${theory.id}" {
                            name "${theory.name}"
                            relative_url "${csst15.GeneralUtils.constructReferenceUrl(grailsLinkGenerator.contextPath,theory)}"
                        }
                    }
                }

                "fields" {
                    allFields.collect { field ->
                        "${field.id}" {
                            name "${field.name}"
                            relative_url "${csst15.GeneralUtils.constructReferenceUrl(grailsLinkGenerator.contextPath,field)}"
                        }
                    }
                }

                "venues" {
                    allVenues.collect { venue ->
                        "${venue.id}" {
                            name "${venue.name}"
                            relative_url "${csst15.GeneralUtils.constructReferenceUrl(grailsLinkGenerator.contextPath,venue)}"
                        }
                    }
                }

//                "people" {
//                    users.collect { user ->
//                        "${user.id}" {
//                            name "${user.firstName} ${user.lastName}"
//                            relative_url "${csst15.GeneralUtils.constructReferenceUrl("user", user.username)}"
//                        }
//                    }
//                }
            }
        }

        render(builder.toPrettyString())
    }

    def peopleGraph() {
        def users = UserRole.findAllByRole(Role.findByAuthority(Roles.USER.name))*.user.unique()
        def allMethods = Entity.findAllByType(csst15.constants.EntityType.METHOD)
        def allTheories = Entity.findAllByType(csst15.constants.EntityType.THEORY)
        def allVenues = Entity.findAllByType(csst15.constants.EntityType.VENUE)
        def allFields = Entity.findAllByType(csst15.constants.EntityType.FIELD)
        def allReferences = Reference.list()

        def builder = new JsonBuilder()
        def root = builder {
            nodes(
                    users.collect { User u ->
                        def userMethods = UserEntity.findAllByUser(u).entity.findAll { Entity method -> method.type == csst15.constants.EntityType.METHOD }.unique()
                        def userTheories = UserEntity.findAllByUser(u).entity.findAll { Entity theory -> theory.type == csst15.constants.EntityType.THEORY }.unique()
                        def userFields = UserEntity.findAllByUser(u).entity.findAll { Entity field -> field.type == csst15.constants.EntityType.FIELD }.unique()
                        def userVenues = UserEntity.findAllByUser(u).entity.findAll { Entity venue -> venue.type == csst15.constants.EntityType.VENUE }.unique()
                        [
                                name        : u.firstName + " " + u.lastName,
                                department  : u.department?.title?: "",
                                position    : u.position?.name?:"",
                                relative_url: csst15.GeneralUtils.constructReferenceUrl(grailsLinkGenerator.contextPath, u),
                                methods     : (userMethods.id),
                                fields      : (userFields.id),
                                venues      : (userVenues.id),
                                theories    : (userTheories.id)
                        ]
                    }
            )

            attributes {
                "methods" {
                    allMethods.collect { method ->
                        "${method.id}" {
                            name "${method.name}"
                            relative_url "${csst15.GeneralUtils.constructReferenceUrl(grailsLinkGenerator.contextPath,method)}"
                        }
                    }
                }

                "theories" {
                    allTheories.collect { theory ->
                        "${theory.id}" {
                            name "${theory.name}"
                            relative_url "${csst15.GeneralUtils.constructReferenceUrl(grailsLinkGenerator.contextPath,theory)}"
                        }
                    }
                }

                "fields" {
                    allFields.collect { field ->
                        "${field.id}" {
                            name "${field.name}"
                            relative_url "${csst15.GeneralUtils.constructReferenceUrl(grailsLinkGenerator.contextPath,field)}"
                        }
                    }
                }

                "venues" {
                    allVenues.collect { venue ->
                        "${venue.id}" {
                            name "${venue.name}"
                            relative_url "${csst15.GeneralUtils.constructReferenceUrl(grailsLinkGenerator.contextPath,venue)}"
                        }
                    }
                }

//                "references" {
//                    allReferences.collect { reference ->
//                        "${reference.id}" {
//                            name "${reference.citation}"
//                            relative_url "${csst15.GeneralUtils.constructReferenceUrl("reference", ReferenceAuthor.findByReference(reference)?.author?.lastName ?: '' + reference?.year + reference?.hash)}"
//                        }
//                    }
//                }
            }
        }


        render(builder.toPrettyString())
    }
}
