<g:applyLayout name="main">
    <!-- Main jumbotron for a primary marketing message or call to action -->
    <div class="container">
        <div class="row top-controls">
            <div class="col-lg-12">

                <form class="form-inline">

                    <div class="row">

                        <div class="form-group col-xs-3 map-type">
                            <div class="center">
                                <span class="h5">Map type:</span>
                                <select id="map-types" class="form-control">
                                    <option data-map-type="PeopleMap">People</option>
                                    <option data-map-type="ReferencesMap">References</option>
                                    <option data-map-type="CharacteristicsMap">Characteristics</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group col-xs-5" id="similarity-types">
                            <div class="center">
                                <span class="h5">Link by:</span>
                                <label class="checkbox-inline fields">
                                    <input type="checkbox" id="fieldsCb" value="fields"> Fields
                                </label>
                                <label class="checkbox-inline methods">
                                    <input type="checkbox" id="methodsCb" value="methods"> Methods
                                </label>
                                <label class="checkbox-inline theories">
                                    <input type="checkbox" id="theoriesCb" value="theories"> Theories
                                </label>
                                <label class="checkbox-inline venues">
                                    <input type="checkbox" id="venuesCb" value="venues"> Venues
                                </label>
                                <label class="checkbox-inline people">
                                    <input type="checkbox" id="peopleCb" value="people"> People
                                </label>
                                <label class="checkbox-inline references">
                                    <input type="checkbox" id="referencesCb" value="references"> References
                                </label>
                            </div>
                        </div>

                        <div class="form-group col-xs-4 search">
                            <input id="node-search" type="text" class="form-control" placeholder="Search">
                        </div>

                    </div>

                </form>

            </div>
        </div>

        <div class="row">
            <div class="col-md-8">
                <div id="visualization">
                </div>

                <div class="loader"></div>
            </div>


            <div id="right-sidebar" class="col-md-4">

                <div class="scroll-area">

                    <div class="attribute_holder PeopleMap">
                        <div class="name_holder">

                        </div>

                        <div class="fields">
                            <h4>Fields</h4>
                        </div>

                        <div class="methods">
                            <h4>Methods</h4>
                        </div>

                        <div class="theories">
                            <h4>Theories</h4>
                        </div>

                        <div class="venues">
                            <h4>Venues</h4>
                        </div>
                    </div>

                    <div class="attribute_holder ReferencesMap">
                        <div class="citation">
                            <h4>Citation</h4>
                        </div>

                        <div class="fields">
                            <h4>Fields</h4>
                        </div>

                        <div class="methods">
                            <h4>Methods</h4>
                        </div>

                        <div class="theories">
                            <h4>Theories</h4>
                        </div>

                        <div class="venues">
                            <h4>Venues</h4>
                        </div>
                    </div>

                    <div class="attribute_holder CharacteristicsMap">
                        <div class="name">
                            <h4>Name</h4>
                        </div>

                        <div class="people">
                            <h4>People</h4>
                        </div>

                        <div class="references">
                            <h4>References</h4>
                        </div>

                    </div>

                </div>
            </div><!-- #right-sidebar-->

        </div>

    </div>
    </div>



                    <!--
                <div class="container">

                    <div class="row">
                        <div class="col-sm-3">
                            <h2>Areas</h2>
    <g:render template="/common/shortEntityList" model="[type: 'field']"/>
    <p><g:link controller="home" action="areas"><em>See more -></em></g:link></p>
        </div>

        <div class="col-sm-3">
            <h2>Theories</h2>
    <g:render template="/common/shortEntityList" model="[type: 'theory']"/>
    <p><g:link controller="home" action="theories"><em>See more -></em></g:link></p>
        </div>

        <div class="col-sm-3">
            <h2>Methods</h2>
    <g:render template="/common/shortEntityList" model="[type: 'method']"/>
    <p><g:link controller="home" action="methods"><em>See more -></em></g:link></p>
        </div>

        <div class="col-sm-3">
            <h2>Venues</h2>
    <g:render template="/common/shortEntityList" model="[type: 'venue']"/>
    <p><g:link controller="home" action="venues"><em>See more -></em></g:link></p>
        </div>
    </div>

    <hr>

    </div>   -->

</g:applyLayout>
<asset:javascript src="scholarmap_csst_js/js/scholarmap.js"/>
<asset:javascript src="kickoff.js"/>