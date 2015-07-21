(function() {
    var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
        extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
        hasProp = {}.hasOwnProperty;

    window.ScholarMapViz = {};

    ScholarMapViz.Map = (function() {
        var active_similarity_types, bind_data, color, data_type, draw_link_by_buttons, force, generate_links, graph, group_by, height, initialize_drawing_area, initialize_force_layout, initialize_tooltips, link_index, link_opacity, link_opacity_cache, link_tip, link_tip_html, link_weight, link_weight_cache, link_width, louvain_communities, louvain_communities_cache, max_link_weight, node_attributes, node_size, node_tip, node_tip_html, refresh_selected_nodes, selected_nodes, set_colors, similarity_exclusions, similarity_types, svg, width;

        similarity_types = void 0;

        node_tip_html = void 0;

        data_type = void 0;

        function Map() {
            similarity_types = this.similarity_types;
            node_tip_html = this.node_tip_html;
            data_type = this.type;
            this.draw();
        }

        Map.prototype.draw = function() {
            ScholarMapViz.$container.html('');
            $('.loader').addClass('loading');
            initialize_drawing_area();
            set_colors();
            initialize_force_layout();
            initialize_tooltips();
            ScholarMapViz.$container.fadeOut(0);
            return this.get_data();
        };

        width = void 0;

        height = void 0;

        svg = void 0;

        initialize_drawing_area = function() {
            width = ScholarMapViz.$container.outerWidth();
            height = ScholarMapViz.$window.height();
            return svg = d3.select(ScholarMapViz.container).append('svg').attr('width', width).attr('height', height);
        };

        color = void 0;

        set_colors = function() {
            return color = d3.scale.category20();
        };

        force = void 0;

        initialize_force_layout = function() {
            return force = d3.layout.force().size([width, height]).linkDistance(function(d) {
                var base, grouping, weight;
                base = 150;
                grouping = group_by(d.source) === group_by(d.target) ? 40 : 0;
                weight = link_weight(d) * 10;
                return base - grouping - weight;
            }).linkStrength(function(d) {
                if (group_by(d.source) === group_by(d.target)) {
                    return 0.05;
                } else {
                    return .01;
                }
            }).charge(-200).gravity(0.3);
        };

        node_tip = void 0;

        link_tip = void 0;

        initialize_tooltips = function() {
            var node_tip_direction, node_tip_offset;
            node_tip_direction = function(override_this) {
                var coords, element, left, right, upper;
                element = override_this instanceof SVGCircleElement ? override_this : this;
                coords = d3.mouse(element);
                upper = coords[1] < (0.5 * height);
                left = coords[0] < (0.25 * width);
                right = coords[0] > (0.75 * width);
                if (upper && left) {
                    return 'se';
                }
                if (upper && right) {
                    return 'sw';
                }
                if (upper) {
                    return 's';
                }
                if (right) {
                    return 'nw';
                }
                if (left) {
                    return 'ne';
                }
                return 'n';
            };
            node_tip_offset = function() {
                var direction;
                direction = node_tip_direction(this);
                if (direction === 'n' || direction === 'nw' || direction === 'ne') {
                    return [-10, 0];
                }
                if (direction === 's' || direction === 'sw' || direction === 'se') {
                    return [10, 0];
                }
            };
            node_tip = d3.tip().attr('class', 'd3-tip').direction(node_tip_direction).offset(node_tip_offset).html(node_tip_html);
            link_tip = d3.tip().attr('class', 'd3-tip').offset(function() {
                return [this.getBBox().height / 2 - 5, 0];
            }).html(link_tip_html);
            svg.call(node_tip);
            return svg.call(link_tip);
        };

        graph = void 0;

        Map.prototype.get_data = function() {
            var j, len, n, ref;
            if (graph) {
                ref = graph.nodes;
                for (j = 0, len = ref.length; j < len; j++) {
                    n = ref[j];
                    n.fixed = false;
                }
                if (graph.type === data_type) {
                    return bind_data();
                }
            }
            return d3.json("http://localhost:8080/ScholarMapClean/api/v1/" + data_type + "/graphs/force-directed?" + (window.location.search.substring(1)), function(error, data) {
                graph = data;
                graph.type = data_type;
                return bind_data();
            });
        };

        selected_nodes = [];

        bind_data = function() {
            var $node_search, group_fill, group_path, groups, hulls, label, node, node_binding_x, node_binding_x_cache, node_binding_y, node_binding_y_cache, node_wrapper, set_link_status, set_related_links_status, visible_link;
            graph.links = generate_links(graph.nodes);
            draw_link_by_buttons(graph.links);
            force.nodes(graph.nodes).links(graph.links).start();
            setTimeout(function() {
                var j, len, n, ref;
                ref = graph.nodes;
                for (j = 0, len = ref.length; j < len; j++) {
                    n = ref[j];
                    n.fixed = true;
                }
                setTimeout(function() {
                    return force.stop();
                }, 50);
                $('.loader').removeClass('loading');
                return ScholarMapViz.$container.fadeIn(500);
            }, 3000);
            visible_link = svg.selectAll('.visible-link').data(graph.links).enter().append('line').attr('data-id', function(d) {
                return d.source.index + "->" + d.target.index;
            }).attr('class', 'visible-link').style('stroke-width', 2).style('opacity', link_opacity);
            node_wrapper = svg.selectAll('.node').data(graph.nodes);
            node = node_wrapper.enter().append('circle').attr('class', 'node').attr('r', node_size).style('fill', function(d) {
                return color(group_by(d));
            }).on('mouseover', node_tip.show).on('mouseenter', function(d) {
                return setTimeout((function() {
                    return set_related_links_status(d, 'active');
                }), 1);
            }).on('click', function(d) {
                if (!(d3.event.metaKey || d3.event.ctrlKey)) {
                    graph.nodes.forEach(function(n) {
                        return n.selected = false;
                    });
                }
                d.selected = true;
                d3.selectAll('.selected').attr('class', function(n) {
                    if (n.selected) {
                        return 'node selected';
                    } else {
                        return 'node';
                    }
                });
                d3.select(this).attr('class', function(n) {
                    if (n.selected) {
                        return 'node selected';
                    } else {
                        return 'node';
                    }
                });
                return refresh_selected_nodes();
            }).on('mouseout', function(d) {
                node_tip.hide();
                return set_related_links_status(d, 'inactive');
            }).call(force.drag);
            label = node_wrapper.enter().append('text').attr('class', 'label').attr('text-anchor', 'middle').style('display', 'none').text(function(d) {
                return d.name;
            });
            $node_search = $('#node-search');
            $node_search.unbind();
            $node_search.on('keyup', _.debounce(function() {
                var j, k, len, len1, n, ref, result, results, search;
                search = this.value;
                ref = graph.nodes;
                for (j = 0, len = ref.length; j < len; j++) {
                    n = ref[j];
                    n.selected = false;
                }
                if (search !== '') {
                    results = _.filter(graph.nodes, function(n) {
                        return (new RegExp(search, 'i')).test(node_tip_html(n));
                    });
                    for (k = 0, len1 = results.length; k < len1; k++) {
                        result = results[k];
                        result.selected = true;
                    }
                }
                d3.selectAll('.node').attr('class', function(d) {
                    if (d.selected) {
                        return 'node selected';
                    } else {
                        return 'node';
                    }
                });
                return refresh_selected_nodes();
            }, 500));
            node_binding_x_cache = {};
            node_binding_x = function(d) {
                if (node_binding_x_cache[d.x]) {
                    return node_binding_x_cache[d.x];
                }
                return node_binding_x_cache[d.x] = Math.max(node_size(d), Math.min(width - node_size(d), d.x));
            };
            node_binding_y_cache = {};
            node_binding_y = function(d) {
                if (node_binding_y_cache[d.y]) {
                    return node_binding_y_cache[d.y];
                }
                return node_binding_y_cache[d.y] = Math.max(node_size(d), Math.min(height - node_size(d), d.y));
            };
            groups = d3.nest().key(group_by).entries(graph.nodes);
            groups = groups.filter(function(group) {
                return group.values.length > 2;
            });
            group_path = function(d) {
                return "M" + (d3.geom.hull(d.values.map(function(p) {
                        return [node_binding_x(p), node_binding_y(p)];
                    })).join('L')) + "Z";
            };
            group_fill = function(d) {
                return color(d.key);
            };
            set_link_status = function(d, status) {
                var $active_link;
                $active_link = $(".visible-link[data-id='" + d.source.index + "->" + d.target.index + "']");
                $active_link.attr('class', $active_link.attr('class').replace(/(^|\s)state-\S+/g, ''));
                return $active_link.attr('class', $active_link.attr('class') + (" state-" + status));
            };
            set_related_links_status = function(current_node, status) {
                var connected_links, j, len, link, results1;
                connected_links = graph.links.filter(function(link) {
                    return link.source.index === current_node.index || link.target.index === current_node.index;
                });
                if (connected_links.length > 0) {
                    results1 = [];
                    for (j = 0, len = connected_links.length; j < len; j++) {
                        link = connected_links[j];
                        results1.push(set_link_status(link, status));
                    }
                    return results1;
                }
            };
            hulls = svg.selectAll('path').data(groups).enter().insert('path', 'circle').attr('class', 'node-group').style('fill', group_fill).style('stroke', group_fill).style('stroke-width', 50).on('click', function(d) {
                if (!(d3.event.metaKey || d3.event.ctrlKey)) {
                    graph.nodes.forEach(function(n) {
                        return n.selected = indexOf.call(d.values, n) >= 0;
                    });
                    d3.selectAll('.node').attr('class', function(n) {
                        if (n.selected) {
                            return 'node selected';
                        } else {
                            return 'node';
                        }
                    });
                    return refresh_selected_nodes();
                }
            });
            return force.on('tick', function() {
                hulls.attr('d', group_path);
                visible_link.attr('x1', function(d) {
                    return node_binding_x(d.source);
                }).attr('y1', function(d) {
                    return node_binding_y(d.source);
                }).attr('x2', function(d) {
                    return node_binding_x(d.target);
                }).attr('y2', function(d) {
                    return node_binding_y(d.target);
                });
                node.attr('cx', node_binding_x).attr('cy', node_binding_y);
                return label.attr('dx', node_binding_x).attr('dy', function(d) {
                    return node_binding_y(d) - 12;
                });
            });
        };

        refresh_selected_nodes = function() {
            var $node_attrs, attributes_html, generate_type_color, i, id, j, k, key, l, len, len1, len2, len3, m, n, ref, ref1, related_to_selected, similarity, similarity_matrix, type, type_color, type_similarity_array;
            selected_nodes = graph.nodes.filter(function(n) {
                return n.selected;
            }).sort(function(a, b) {
                if (node_tip_html(a) < node_tip_html(b)) {
                    return -1;
                }
                if (node_tip_html(a) > node_tip_html(b)) {
                    return 1;
                }
                return 0;
            });
            if (selected_nodes.length > 0) {
                $('.node.selected').css('opacity', 1);
                $('.node:not(.selected)').css('opacity', 0.5);
            } else {
                $('.node').css('opacity', 1);
            }
            if (selected_nodes.length === 1) {
                related_to_selected = function(d) {
                    var j, len, link, ref;
                    ref = graph.links;
                    for (j = 0, len = ref.length; j < len; j++) {
                        link = ref[j];
                        if (link.source === selected_nodes[0] && link.target === d) {
                            return true;
                        }
                        if (link.target === selected_nodes[0] && link.source === d) {
                            return true;
                        }
                    }
                    return false;
                };
                d3.selectAll('.label').style('display', function(d) {
                    if (d.selected || related_to_selected(d)) {
                        return 'block';
                    } else {
                        return 'none';
                    }
                });
            } else {
                d3.selectAll('.label').style('display', function(d) {
                    if (d.selected) {
                        return 'block';
                    } else {
                        return 'none';
                    }
                });
            }
            $('#node-title').html('<div class="expandable">' + selected_nodes.map(function(n, i) {
                    return ((i === 5 ? '<span class="break-point"></span>' : '') + "\n<a href=\"" + n.relative_url + "\">" + (node_tip_html(n)) + "</a>").replace(/^\s+|\s+$/g, '');
                }).join(', ') + '</div>');
            $node_attrs = $('#node-attrs').html('');
            if (selected_nodes.length === 0) {
                return;
            }
            if (selected_nodes.length === 1) {
                for (key in selected_nodes[0]) {
                    if (key === 'name' || key === 'citation' || key === 'relative_url') {
                        continue;
                    }
                    if (key === 'index' || indexOf.call(similarity_types(), key) >= 0) {
                        break;
                    }
                    $node_attrs.append("<h4>" + (key[0].toUpperCase() + key.slice(1)) + "</h4>\n<p>" + (typeof selected_nodes[0][key] === 'object' ? selected_nodes[0][key].join(', ') : selected_nodes[0][key]) + "</p>");
                }
            }
            similarity_matrix = {};
            ref = similarity_types();
            for (j = 0, len = ref.length; j < len; j++) {
                type = ref[j];
                similarity_matrix[type] = {};
                for (k = 0, len1 = selected_nodes.length; k < len1; k++) {
                    n = selected_nodes[k];
                    if (n[type]) {
                        ref1 = n[type];
                        for (l = 0, len2 = ref1.length; l < len2; l++) {
                            id = ref1[l];
                            if (similarity_matrix[type][id]) {
                                similarity_matrix[type][id] += 1;
                            } else {
                                similarity_matrix[type][id] = 1;
                            }
                        }
                    }
                }
            }
            for (type in similarity_matrix) {
                if (selected_nodes.length !== 1) {
                    for (id in similarity_matrix[type]) {
                        if (similarity_matrix[type][id] === 1) {
                            delete similarity_matrix[type][id];
                        }
                    }
                }
                if (Object.keys(similarity_matrix[type]).length === 0) {
                    delete similarity_matrix[type];
                }
            }
            generate_type_color = d3.scale.category10();
            for (type in similarity_matrix) {
                type_color = d3.rgb(generate_type_color(type));
                $node_attrs.append("<h4>" + (type[0].toUpperCase() + type.slice(1)) + "</h4>");
                type_similarity_array = [];
                for (id in similarity_matrix[type]) {
                    type_similarity_array.push(_.extend(graph.attributes[type][id], {
                        count: similarity_matrix[type][id]
                    }));
                }
                type_similarity_array = _.sortBy(type_similarity_array, function(similarity) {
                    return -similarity.count;
                });
                attributes_html = '';
                for (i = m = 0, len3 = type_similarity_array.length; m < len3; i = ++m) {
                    similarity = type_similarity_array[i];
                    attributes_html += ((i === 5 ? '<span class="break-point"></span>' : '') + "\n<span style=\"background:" + (type_color.darker(similarity.count - 1).toString()) + ";\" class=\"node-attribute\">\n  <a href=\"" + similarity.relative_url + "\">" + similarity.name + "</a>\n</span>").replace(/^\s+|\s+$/g, '');
                }
                $node_attrs.append("<div class=\"expandable\">" + attributes_html + "</div>");
            }
            return $('.expandable').expander({
                slicePoint: 999,
                sliceOn: '<span class="break-point"></span>',
                expandPrefix: ' ',
                expandText: '<button class="btn btn-primary btn-xs">more</button>',
                userCollapsePrefix: ' ',
                userCollapseText: '<button class="btn btn-primary btn-xs">less</button>',
                expandEffect: 'fadeIn',
                collapseEffect: 'fadeOut'
            });
        };

        louvain_communities_cache = void 0;

        louvain_communities = function() {
            var j, louvain_edges, louvain_nodes, ref, results1;
            if (louvain_communities_cache) {
                return louvain_communities_cache;
            }
            louvain_nodes = (function() {
                results1 = [];
                for (var j = 0, ref = graph.nodes.length; 0 <= ref ? j <= ref : j >= ref; 0 <= ref ? j++ : j--){ results1.push(j); }
                return results1;
            }).apply(this);
            louvain_edges = graph.links.map(function(link) {
                return {
                    source: link.source.index,
                    target: link.target.index,
                    weight: link_weight(link)
                };
            });
            return louvain_communities_cache = jLouvain().nodes(louvain_nodes).edges(louvain_edges)();
        };

        group_by = function(d) {
            return louvain_communities()[d.index];
        };

        node_size = function() {
            return 10;
        };

        node_attributes = function(nodes) {
            var attributes, key;
            attributes = [];
            for (key in nodes[0]) {
                if (key === 'index') {
                    return attributes;
                }
                attributes.push(key);
            }
        };

        link_tip_html = function(d) {
            return d.similarities.map(function(similarity) {
                var attribute_names, type;
                type = similarity.type[0].toUpperCase() + similarity.type.slice(1);
                attribute_names = similarity.list.map(function(item) {
                    return graph.attributes[similarity.type][item.id].name;
                });
                return "<span class=\"d3-tip-label\">" + type + ":</span> " + (attribute_names.join(', '));
            }).join('<br>');
        };

        link_index = function(d) {
            return d.source.index + "->" + d.target.index;
        };

        link_weight_cache = {};

        link_weight = function(d) {
            var total_weight, weights;
            if (link_weight_cache[link_index(d)]) {
                return link_weight_cache[link_index(d)];
            }
            weights = _.flatten(d.similarities.map(function(similarity) {
                return similarity.list.map(function(item) {
                    return item.weight;
                });
            }));
            total_weight = weights.reduce(function(a, b) {
                return a + b;
            });
            return link_weight_cache[link_index(d)] = total_weight;
        };

        link_width = function(d) {
            return Math.log(d3.max([2, link_weight(d)]));
        };

        link_opacity_cache = {};

        max_link_weight = void 0;

        link_opacity = function(d) {
            var calculated_weight;
            link_opacity_cache = link_opacity_cache || {};
            if (link_opacity_cache[link_index(d)]) {
                return link_opacity_cache[link_index(d)];
            }
            max_link_weight = max_link_weight || d3.max(Object.keys(link_weight_cache).map(function(key) {
                    return link_weight_cache[key];
                }));
            calculated_weight = link_weight(d) / max_link_weight;
            return link_opacity_cache[link_index(d)] = calculated_weight;
        };

        Map.prototype.node_tip_html = function(d) {
            return d.name;
        };

        draw_link_by_buttons = function(links) {
            var formatted_type, j, len, ref, type;
            if (ScholarMapViz.$similarity_types.data('links-for') === data_type) {
                return;
            }
            ScholarMapViz.$similarity_types.data('links-for', data_type);
            ScholarMapViz.$similarity_types.css('display', 'none');
            ScholarMapViz.$similarity_types.html('');
            ref = similarity_types();
            for (j = 0, len = ref.length; j < len; j++) {
                type = ref[j];
                formatted_type = type[0].toUpperCase() + type.slice(1);
                ScholarMapViz.$similarity_types.append("<div class=\"checkbox\">\n  <label>\n    <input type=\"checkbox\" data-similarity-type=\"" + type + "\" value=\"" + type + "\" checked>\n    " + formatted_type + "\n  </label>\n</div>");
            }
            return ScholarMapViz.$similarity_types.fadeIn(500);
        };

        generate_links = function(nodes) {
            var active_types, links;
            louvain_communities_cache = void 0;
            active_types = active_similarity_types();
            links = _.map(nodes, function(n, index) {
                return _.slice(nodes, index + 1, nodes.length).map(function(other_node) {
                    var any_links, j, len, node_attr_ids, other_node_attr_ids, similarities, similarity_type;
                    similarities = {};
                    any_links = false;
                    for (j = 0, len = active_types.length; j < len; j++) {
                        similarity_type = active_types[j];
                        similarities[similarity_type] = n[similarity_type] && other_node[similarity_type] ? n[similarity_type] && typeof n[similarity_type][0] === 'object' ? (node_attr_ids = _.map(n[similarity_type], function(similarity) {
                            return similarity.id;
                        }), other_node_attr_ids = _.map(other_node[similarity_type], function(similarity) {
                            return similarity.id;
                        }), similarities[similarity_type] = _.map(_.intersection(node_attr_ids, other_node_attr_ids), function(id) {
                            var node_attr_weight, other_node_attr_weight;
                            node_attr_weight = _.find(n[similarity_type], function(item) {
                                return item.id === id;
                            }).weight;
                            other_node_attr_weight = _.find(other_node[similarity_type], function(item) {
                                return item.id === id;
                            }).weight;
                            return {
                                id: id,
                                weight: (node_attr_weight + other_node_attr_weight) / 2
                            };
                        })) : (node_attr_ids = n[similarity_type], other_node_attr_ids = other_node[similarity_type], similarities[similarity_type] = _.map(_.intersection(node_attr_ids, other_node_attr_ids), function(id) {
                            return {
                                id: id,
                                weight: 50
                            };
                        })) : [];
                        if (similarities[similarity_type].length > 0) {
                            any_links = true;
                        }
                    }
                    if (any_links) {
                        return {
                            source: nodes.indexOf(n),
                            target: nodes.indexOf(other_node),
                            similarities: _.filter(_.map(active_types, function(similarity_type) {
                                return {
                                    type: similarity_type,
                                    list: similarities[similarity_type]
                                };
                            }), function(similarity) {
                                return similarity.list.length > 0;
                            })
                        };
                    } else {
                        return null;
                    }
                });
            });
            links = _.compact(_.flatten(links));
            return _.sortBy(links, function(link) {
                return -link_weight(link);
            }).slice(0, +Math.floor(graph.nodes.length * 3) + 1 || 9e9);
        };

        similarity_exclusions = function() {
            return $.makeArray(ScholarMapViz.$similarity_types.find('input[type="checkbox"]:not(:checked)')).map(function(type) {
                return type.value;
            });
        };

        active_similarity_types = function() {
            return similarity_types().filter(function(type) {
                return similarity_exclusions().indexOf(type) < 0;
            });
        };

        return Map;

    })();

    ScholarMapViz.PeopleMap = (function(superClass) {
        extend(PeopleMap, superClass);

        function PeopleMap() {
            this.type = 'people';
            PeopleMap.__super__.constructor.apply(this, arguments);
        }

        PeopleMap.prototype.similarity_types = function() {
            return ['fields', 'methods', 'theories', 'venues', 'references'];
        };

        return PeopleMap;

    })(ScholarMapViz.Map);

    ScholarMapViz.ReferencesMap = (function(superClass) {
        extend(ReferencesMap, superClass);

        function ReferencesMap() {
            this.type = 'references';
            ReferencesMap.__super__.constructor.apply(this, arguments);
        }

        ReferencesMap.prototype.similarity_types = function() {
            return ['fields', 'methods', 'theories', 'venues', 'people'];
        };

        ReferencesMap.prototype.node_tip_html = function(d) {
            return (d.authors.split(',')[0]) + " " + d.year;
        };

        return ReferencesMap;

    })(ScholarMapViz.Map);

    ScholarMapViz.CharacteristicsMap = (function(superClass) {
        extend(CharacteristicsMap, superClass);

        function CharacteristicsMap() {
            this.type = 'characteristics';
            CharacteristicsMap.__super__.constructor.apply(this, arguments);
        }

        CharacteristicsMap.prototype.similarity_types = function() {
            return ['people', 'references'];
        };

        return CharacteristicsMap;

    })(ScholarMapViz.Map);

    ScholarMapViz.DataToggle = (function() {
        var choose_data;

        function DataToggle() {
            $('#map-types').on('click', 'button', function() {
                var $current_button;
                $current_button = $(this);
                return choose_data($current_button, function() {
                    return ScholarMapViz.current_map = new ScholarMapViz[$current_button.data('map-type')];
                });
            });
        }

        choose_data = function($current, activation_callback) {
            if (!$current.hasClass('active')) {
                $current.siblings().removeClass('active');
                $current.addClass('active');
                ScholarMapViz.$similarity_types.html('');
                return activation_callback();
            }
        };

        return DataToggle;

    })();

    ScholarMapViz.LinkTypeToggles = (function() {
        function LinkTypeToggles() {
            ScholarMapViz.$similarity_types.on('click', 'input[type="checkbox"]', function() {
                var $this;
                $this = $(this);
                if (ScholarMapViz.$similarity_types.find('input:checked').length === 0) {
                    return $this.prop('checked', true);
                } else {
                    ScholarMapViz.current_map.link_weight_cache = {};
                    return ScholarMapViz.current_map.draw();
                }
            });
        }

        return LinkTypeToggles;

    })();

    ScholarMapViz.Initializer = (function() {
        function Initializer() {
            this.setup();
            this.fetch_default_data();
            new ScholarMapViz.DataToggle;
            new ScholarMapViz.LinkTypeToggles;
        }

        Initializer.prototype.setup = function() {
            ScholarMapViz.$window = $(window);
            ScholarMapViz.container = '#visualization';
            ScholarMapViz.$container = $(ScholarMapViz.container);
            return ScholarMapViz.$similarity_types = $('#similarity-types');
        };

        Initializer.prototype.fetch_default_data = function() {
            ScholarMapViz.current_map = new ScholarMapViz.PeopleMap;
            return $('#map-types').find('button[data-map-type="PeopleMap"]').addClass('active');
        };

        return Initializer;

    })();

    $(function() {
        return new ScholarMapViz.Initializer;
    });

}).call(this);