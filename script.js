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
  function cleanCookies() {
    document.cookie = '';
  }
  function cleanArray(array) {
    var i, j, len = array.length, out = [], obj = {};
    for (i = 0; i < len; i++) {
      obj[array[i]] = 0;
    }
    for (j in obj) {
      out.push(j);
    }
    return out;
  }

  var app = new Vue({
    el: '#app',
    data: {
      users:            [],
      challenges:       [],
      display_draw:     true,
      display_params:   false,
      display_challenge:false,
      current_user:     null,
      user_names:       null,
      modal_content:    false,
      is_challenge:     false,
      challenger:       { name: '', challenge: '' },
      input_list:       [{ value: ''}],
      /* end of data */
    },
    methods: {
      discardModal: function() {
        $('.reveal-modal').remove();
        $('.reveal-modal-bg').remove();
      },
      cleanProject: function(event) {
        this.users = [];
        this.modal_content = true;
        $('#modalTitle').html('Qui sont vos utilisateurs ?');
        cleanCookies();
      },
      saveNames: function(event) {
        var users = [];

        for (var index in this.input_list) {
          if (this.input_list[index].value != '') {
            users.push(this.input_list[index].value);
          }
        }

        this.user_names = cleanArray(users);
        setCookie('users', JSON.stringify(this.user_names), 365);
        for (var index in this.user_names) {
          this.users[this.user_names[index]] = {
            name:       users[index],
            warframes:  [],
            primary:    [],
            secondary:  [],
            melee:      [],
          };
        }
        this.current_user = this.users[this.user_names[0]];
        this.discardModal();
      },
      fromCache: function(event) {
        var user_names = getCookie('users');
        if (typeof user_names !== 'undefined' && user_names.length != 0) {
          this.user_names = JSON.parse(user_names)
          this.initFromCache(this.user_names);
          this.discardModal();
        } else {
          this.cleanProject(event);
        }
      },
      addUser: function(event) {
        this.input_list.push({ value: ''});
      },
      removeUser: function(index, event) {
        this.input_list.splice(index, 1);
      },
      initFromCache: function(users) {
        var cache = {};

        for (var index in users) {
          cache[users[index]] = {
            warframes:  getCookie(users[index] + '_warframes'),
            primary:    getCookie(users[index] + '_primary'),
            secondary:  getCookie(users[index] + '_secondary'),
            melee:      getCookie(users[index] + '_melee'),
          };
        }

        var challenges = getCookie('challenges');
        if (challenges !== 'undefined' && challenges.length > 0) {
          this.challenges = JSON.parse(challenges);
        }

        for (var index in cache) {
          var user = {
            name: index
          };

          for (var key in cache[index]) {
            user[key] = [];

            if (typeof cache[index][key] !== 'undefined' && cache[index][key].length != 0) {
              tmp = JSON.parse(cache[index][key]);

              for (var i = 0 ; i < tmp.length ; ++i) {
                user[key].push({ origin: tmp[i], snake: _.snakeCase(tmp[i]) });
              }
            } else {
              user[key] = [];
            }
          }

          this.users[index] = user;
        }

        this.current_user = this.users[users[0]];
        this.restoreTextarea();
      },
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
        this.display_draw       = false;
        this.display_params     = false;
        this.display_challenge  = false;
        if (id == 'tirage') {
          this.display_draw       = true;
        } else if (id == 'params') {
          this.display_params     = true;
        } else if (id == 'challenge') {
          this.display_challenge  = true;
        }
      },
      changeUser: function(name, event) {
        /* clean */
        $('textarea').val('');
        $('#slots div').html('?')

        for (var index in this.users) {
          if (this.users[index].name == name) {
            this.current_user = this.users[index];
            break;
          }
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
        setCookie(this.current_user.name + '_warframes', JSON.stringify(light_for_cookie), 365);
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
        setCookie(this.current_user.name + '_primary', JSON.stringify(light_for_cookie), 365);
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
        setCookie(this.current_user.name + '_secondary', JSON.stringify(light_for_cookie), 365);
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
        setCookie(this.current_user.name + '_melee', JSON.stringify(light_for_cookie), 365);
      },
      putChallenges: function(event) {
        var challenges = [];
        var values = this.parse_textarea($(event.target).val());

        for (var index in values) {
          challenges.push(values[index]);
        }
        this.challenges = challenges;
        setCookie('challenges', JSON.stringify(challenges), 365);
      },
      parse_textarea: function(content) {
        return content.split("\n");
      },
      pickChallenge: function() {
        var nums = this.getNumsFromRange({
          is_challenge:     2,
          challenger:       this.user_names.length,
          challenge_name:   this.challenges.length
        });

        if (nums.is_challenge) {
          this.is_challenge = true;
          this.challenger.name = this.user_names[nums.challenger];
          this.challenger.challenge = this.challenges[nums.challenge_name];
        } else {
          this.is_challenge = false;
          this.challenger.name = '';
          this.challenger.challenge = '';
        }

      },
      addChallenge: function() {
        var nums = this.getNumsFromRange({
          challenge_name:   this.challenges.length
        });

        this.challenger.challenge += '<br />' + this.challenges[nums.challenge_name];
      }
      /* end of methods*/
    },
  });

  $(document).foundation();
}());
