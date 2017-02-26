(function () {
  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  var app = new Vue({
    el: '#app',
    data: {
      lund: {
        name:       'Lund',
        warframes:  [],
        primary:    [],
        secondary:  [],
        melee:      [],
      },
      ystaroth: {
        name:    'Ystaroth',
        warframes:  [],
        primary:    [],
        secondary:  [],
        melee:      [],
      },
      display_draw:     true,
      display_params:   false,
      current_user:     null,
      /* end of data */
    },
    mounted: function() {
      var cached_data_lund = {
        warframes:  getCookie('Lund_warframes'),
        primary:    getCookie('Lund_primary'),
        secondary:  getCookie('Lund_secondary'),
        melee:      getCookie('Lund_melee'),
      };
      var cached_data_ystaroth = {
        warframes:  getCookie('Ystaroth_warframes'),
        primary:    getCookie('Ystaroth_primary'),
        secondary:  getCookie('Ystaroth_secondary'),
        melee:      getCookie('Ystaroth_melee'),
      };

      for (var index in cached_data_lund) {
        if (typeof cached_data_lund[index] !== 'undefined' && cached_data_lund[index].length != 0) {
          tmp = JSON.parse(cached_data_lund[index]);

          for (var i = 0 ; i < tmp.length ; ++i) {
            this.lund[index].push({ origin: tmp[i], snake: _.snakeCase(tmp[i]) });
          }
        }
      }
      for (var index in cached_data_ystaroth) {
        if (typeof cached_data_ystaroth[index] !== 'undefined' && cached_data_ystaroth[index].length != 0) {
          tmp = JSON.parse(cached_data_ystaroth[index]);

          for (var i = 0 ; i < tmp.length ; ++i) {
            this.ystaroth[index].push({ origin: tmp[i], snake: _.snakeCase(tmp[i]) });
          }
        }
      }

      this.current_user = this.lund;
      this.restoreTextarea();
    },
    methods: {
      getNumsFromRange: function (obj) {
    		var getRandomInt = function (max) {
    			return Math.floor(Math.random() * max);
    		};

        var return_value = {};

        for (var index in obj) {
          return_value[index] = getRandomInt(obj[index]);
        }

    		return return_value;
    	},
      changeTab: function(event) {
        id = $(event.target).attr('id');
        if (id == 'tirage') {
          this.display_draw   = true;
          this.display_params = false;
        } else if (id == 'params') {
          this.display_draw   = false;
          this.display_params = true;
        }
      },
      changeUser: function(event) {
        /* clean */
        $('textarea').val('');
        $('#slots div').html('?')

        if (this.current_user.name == "Lund") {
          this.current_user = this.ystaroth;
        } else {
          this.current_user = this.lund;
        }

        this.restoreTextarea();
      },
      restoreTextarea: function() {
        $('textarea').val('');

        var list = "";
        var options = ['warframes', 'primary', 'secondary', 'melee'];
        var i = 0;
        var area = 0;

        for (var name_option in options) {
          i = 0;
          list = '';

          for (var index in this.current_user[options[name_option]]) {
            if (i != 0) {
              list += "\n";
            }
            list += this.current_user[options[name_option]][index].origin;
            ++i;
          }
          $($('textarea')[area]).val(list);
          ++area;
        }

      },
      roll: function(event) {
        var nums = this.getNumsFromRange({
          warframes: this.current_user.warframes.length,
          primary: this.current_user.primary.length,
          secondary: this.current_user.secondary.length,
          melee: this.current_user.melee.length
        });

    		// Spin each slot
        var i = 0;
        var that = this;
        for (var index in nums) {
          // Asynchronous hack to send the variable incremented without a change of value
          (function(count, type) {
            setTimeout(function () {
              var elm = $('#slots div:nth-child(' + (count + 1) + ')');
        			elm.toggleClass('spin');

      				setTimeout(function () {
                if (typeof that.current_user[type][nums[type]] !== 'undefined' && that.current_user[type][nums[type]].origin != '') {
        					elm.html('<img src="assets/' + type + "/" + that.current_user[type][nums[type]].snake + '.png" /><br />' + that.current_user[type][nums[type]].origin);
                } else {
                  elm.html('?');
                }
      				}, 335);
      			}, i * 100);
          })(i, index);

          ++i;
        }
      },
      putWarframes: function(event) {
        var final = [];
        var light_for_cookie = [];
        var values = this.parse_textarea($(event.target).val());
        var origin = this.parse_textarea($(event.target).val());

        for (var index in values) {
          final.push({origin: origin[index], snake: _.snakeCase(values[index]) });
          light_for_cookie.push(origin[index]);
        }
        this.current_user.warframes = final;
        setCookie(this.current_user.name + '_warframes', JSON.stringify(light_for_cookie));
      },
      putPrimaries: function(event) {
        var final = [];
        var light_for_cookie = [];
        var values = this.parse_textarea($(event.target).val());
        var origin = this.parse_textarea($(event.target).val());

        for (var index in values) {
          final.push({origin: origin[index], snake: _.snakeCase(values[index]) });
          light_for_cookie.push(origin[index]);
        }
        this.current_user.primary = final;
        setCookie(this.current_user.name + '_primary', JSON.stringify(light_for_cookie));
      },
      putSecondaries: function(event) {
        var final = [];
        var light_for_cookie = [];
        var values = this.parse_textarea($(event.target).val());
        var origin = this.parse_textarea($(event.target).val());

        for (var index in values) {
          final.push({origin: origin[index], snake: _.snakeCase(values[index]) });
          light_for_cookie.push(origin[index]);
        }
        this.current_user.secondary = final;
        setCookie(this.current_user.name + '_secondary', JSON.stringify(light_for_cookie));
      },
      putMelees: function(event) {
        var final = [];
        var light_for_cookie = [];
        var values = this.parse_textarea($(event.target).val());
        var origin = this.parse_textarea($(event.target).val());

        for (var index in values) {
          final.push({origin: origin[index], snake: _.snakeCase(values[index]) });
          light_for_cookie.push(origin[index]);
        }
        this.current_user.melee = final;
        setCookie(this.current_user.name + '_melee', JSON.stringify(light_for_cookie));
      },
      parse_textarea: function(content) {
        return content.split("\n");
      }
      /* end of methods*/
    },
  });

}());
