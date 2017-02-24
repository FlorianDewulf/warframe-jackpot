(function () {
  var app = new Vue({
    el: '#app',
    data: {
      lund: {
        name:    'Lund',
        frames:  [],
        weapons: [],
        pistols: [],
        melees:  [],
      },
      ystaroth: {
        name:    'Ystaroth',
        frames:  [],
        weapons: [],
        pistols: [],
        melees:  [],
      },
      display_draw:     true,
      display_params:   false,
      current_user:     null,
      /* end of data */
    },
    mounted: function() {
      this.current_user = this.lund;
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
        this.current_user.frames  = [];
        this.current_user.weapons = [];
        this.current_user.pistols = [];
        this.current_user.melees  = [];
        $('textarea').val('');
        $('#slots span').html('?')

        if (this.current_user.name == "Lund") {
          this.current_user = this.ystaroth;
        } else {
          this.current_user = this.lund;
        }
      },
      roll: function(event) {
        var nums = this.getNumsFromRange({
          frames: this.current_user.frames.length,
          weapons: this.current_user.weapons.length,
          pistols: this.current_user.pistols.length,
          melees: this.current_user.melees.length
        });

        console.log(nums);

    		// Spin each slot
        var i = 0;
        var that = this;
        for (var index in nums) {
          // Asynchronous hack to send the variable incremented without a change of value
          (function(count, type) {
            setTimeout(function () {
              var elm = $('#slots span:nth-child(' + (count + 1) + ')');
        			elm.toggleClass('spin');

      				setTimeout(function () {
      					var tries, winner;
                console.log(elm, that.current_user[type], nums[type], that.current_user[type][nums[type]]);
      					elm.html(that.current_user[type][nums[type]]);
      				}, 335);
      			}, i * 100);
          })(i, index);

          ++i;
        }
      },
      putFrames: function(event) {
        this.current_user.frames = this.parse_textarea($(event.target).val());
      },
      putWeapons: function(event) {
        this.current_user.weapons = this.parse_textarea($(event.target).val());
      },
      putPistols: function(event) {
        this.current_user.pistols = this.parse_textarea($(event.target).val());
      },
      putMelees: function(event) {
        this.current_user.melees = this.parse_textarea($(event.target).val());
      },
      parse_textarea: function(content) {
        return content.split("\n");
      }
      /* end of methods*/
    },
  });

}());
