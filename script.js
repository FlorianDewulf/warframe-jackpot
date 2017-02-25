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
    console.log('set cookie : ', cname + "=" + cvalue + ";" + expires + ";path=/");
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
      var cached_data = getCookie('data');
      console.log('get : ', cached_data);

      if (typeof cached_data !== 'undefined' && cached_data.length != 0) {
        var cached_data = JSON.parse(cached_data);
        console.log('after parse : ', cached_data);
        if (typeof cached_data.lund !== 'undefined' && cached_data.lund.length != 0) {
          this.lund = cached_data.lund;
          console.log('lund : ', this.lund);
        }
        if (typeof cached_data.ystaroth !== 'undefined' && cached_data.ystaroth.length != 0) {
          this.ystaroth = cached_data.ystaroth;
          console.log('ysta : ', this.ystaroth);
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
        var i = 0;

        for (var index in this.current_user.warframes) {
          if (i != 0) {
            list += "\n";
          }
          $('body').append('<img src="assets/warframes/' + this.current_user.warframes[index].snake + '.png" />');
          list += this.current_user.warframes[index].original;
          ++i;
        }
        $($('textarea')[0]).val(list);
        list = '';

        i = 0;
        for (var index in this.current_user.primary) {
          if (i != 0) {
            list += "\n";
          }
          $('body').append('<img src="assets/primary/' + this.current_user.primary[index].snake + '.png" />');
          list += this.current_user.primary[index].original;
          ++i;
        }
        $($('textarea')[1]).val(list);
        list = '';

        i = 0;
        for (var index in this.current_user.secondary) {
          if (i != 0) {
            list += "\n";
          }
          $('body').append('<img src="assets/secondary/' + this.current_user.secondary[index].snake + '.png" />');
          list += this.current_user.secondary[index].original;
          ++i;
        }
        $($('textarea')[2]).val(list);
        list = '';

        i = 0;
        for (var index in this.current_user.melee) {
          if (i != 0) {
            list += "\n";
          }
          $('body').append('<img src="assets/melee/' + this.current_user.melee[index].snake + '.png" />');
          list += this.current_user.melee[index].original;
          ++i;
        }
        $($('textarea')[3]).val(list);
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
                if (typeof that.current_user[type][nums[type]] !== 'undefined' && that.current_user[type][nums[type]].original != '') {
        					elm.html('<img src="assets/' + type + "/" + that.current_user[type][nums[type]].snake + '.png" /><br />' + that.current_user[type][nums[type]].original);
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
        var values = this.parse_textarea($(event.target).val());
        var original = this.parse_textarea($(event.target).val());

        for (var index in values) {
          final.push({original: original[index], snake: _.snakeCase(values[index]) });
        }
        this.current_user.warframes = final;
        this.store_datas();
      },
      putPrimaries: function(event) {
        var final = [];
        var values = this.parse_textarea($(event.target).val());
        var original = this.parse_textarea($(event.target).val());

        for (var index in values) {
          final.push({original: original[index], snake: _.snakeCase(values[index]) });
        }
        this.current_user.primary = final;
        this.store_datas();
      },
      putSecondaries: function(event) {
        var final = [];
        var values = this.parse_textarea($(event.target).val());
        var original = this.parse_textarea($(event.target).val());

        for (var index in values) {
          final.push({original: original[index], snake: _.snakeCase(values[index]) });
        }
        this.current_user.secondary = final;
        this.store_datas();
      },
      putMelees: function(event) {
        var final = [];
        var values = this.parse_textarea($(event.target).val());
        var original = this.parse_textarea($(event.target).val());

        for (var index in values) {
          final.push({original: original[index], snake: _.snakeCase(values[index]) });
        }
        console.log('FINAL', final);
        this.current_user.melee = final;
        this.store_datas();
      },
      parse_textarea: function(content) {
        return content.split("\n");
      },
      store_datas: function() {
        console.log('BEFORE STORAGE', this.lund, this.ystaroth);
        setCookie("data", JSON.stringify({ lund: this.lund, ystaroth: this.ystaroth }), 365);
      }
      /* end of methods*/
    },
  });

}());
