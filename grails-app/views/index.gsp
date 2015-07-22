<g:applyLayout name="main">
    <!-- Main jumbotron for a primary marketing message or call to action -->
    <div class="container">
        <div class="row">
            <div id="left-sidebar" class="col-lg-4 text-center">

                <div class="scroll-area">

                    <div class="form-group">
                        <div class="btn-group" role="group" id="map-types" aria-label="Map Type">
                            <button type="button" class="btn btn-default" data-map-type="PeopleMap">People</button>
                            <button type="button" class="btn btn-default"
                                    data-map-type="ReferencesMap">References</button>
                            <button type="button" class="btn btn-default"
                                    data-map-type="CharacteristicsMap">Characteristics</button>
                        </div>
                    </div>

                    <div class="form-group">
                        <input id="node-search" type="text" class="form-control" placeholder="Search">
                    </div>

                    <h2 class="h3 text-center">Link by</h2>

                    <div role="group" id="similarity-types" aria-label="Link by"></div>

                </div>

            </div>

            <div class="col-lg-4">
                <div id="visualization">
                </div>
                <div class="loader"></div>
            </div>



            <div id="right-sidebar" class="col-lg-4">

                <div class="scroll-area">
                    <h3 id="node-title"></h3>

                    <div id="node-attrs"></div>
                </div>

            </div>

        </div>
    </div>

    <div class="container">
        <!-- Example row of columns -->
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

    </div> <!-- /container -->

</g:applyLayout>
<asset:javascript src="scholarmap_csst_js/js/scholarmap.js"/>
<asset:javascript src="kickoff.js"/>