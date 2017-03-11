<!DOCTYPE html>
<html>
  <!-- .php to match on Heroku -->
  <head>
    <title>RandomFrame</title>
    <meta charset="UTF-8"/>
    <link rel="stylesheet" href="./foundation.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="style.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="./foundation.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.1.10/vue.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js"></script>
  </head>
  <body>
    <div id="app">
      <header>
        <div class="top-bar">
          <div class="top-bar-left">
            <ul class="dropdown menu" data-dropdown-menu>
              <li class="menu-text">RandomFrame</li>
              <li v-bind:class="{ active: display_draw }" @click.prevent="changeTab"><a href="#" id="tirage">Tirage</a></li>
              <li v-bind:class="{ active: display_params }" @click.prevent="changeTab"><a href="#" id="params">Paramètres</a></li>
              <li v-bind:class="{ active: display_challenge }" @click.prevent="changeTab"><a href="#" id="challenge">Challenges</a></li>
            </ul>
          </div>
        </div>
      </header>
      <section class="container">
        <div class="row">
          <div id="tirage" v-show="display_draw">
            <h1 class="text-center">
              <ul class="dropdown menu" data-dropdown-menu>
                <li><a href="#current_user" class="text">{{ current_user ? current_user.name : '' }}</a></li>
                <li>
                  <a class="button tiny" href="#list"><i class="fa fa-refresh" aria-hidden="true"></i></a>
                  <ul class="menu">
                    <li v-for="name in user_names" @click.prevent="changeUser(name, $event)" v-bind:class="{ selected: (current_user && current_user.name == name ? true : false) }">
                      <a href="#{{name}}">{{ name }}</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </h1>
            <hr />
            <div class="slots" id="slots">
              <div class="text-center">?</div>
              <div class="text-center">?</div>
              <div class="text-center">?</div>
              <div class="text-center">?</div>
            </div>
            <br>
            <div class="text-center"><a href="#" id="hitMe" @click.prevent="roll" class="button">Random</a></div>
            <hr />
            <div class="row">
              <div class="columns small-offset-1 small-3">
                <h3 class="text-center">Challenge ?</h3>
                <p>{{ is_challenge ? 'Oui' : 'Non'}}</p>
              </div>
              <div class="columns small-2">
                <h3 class="text-center">Joueur ?</h3>
                <transition name="fade">
                  <p v-show="is_challenge">{{ challenger.name }}</p>
                </transition>
              </div>
              <div class="columns small-4">
                <h3>Intitulé du challenge</h3>
                <transition name="fade">
                  <p v-show="is_challenge" v-html="challenger.challenge"></p>
                </transition>
              </div>
            </div>
            <div class="text-center">
              <button class="button warning" @click="pickChallenge">Challenge ?</button>
              <button class="button warning" @click="addChallenge">Challenge supplémentaire ?</button>
            </div>
          </div>
          <div id="params" v-show="display_params" class="clearfix">
            <div class="columns medium-3">
              <h4 class="text-center">Warframes</h4>
              <textarea @change="putWarframes" @keyup="putWarframes"></textarea>
            </div>
            <div class="columns medium-3">
              <h4 class="text-center">Armes Principales</h4>
              <textarea @change="putPrimaries" @keyup="putPrimaries"></textarea>
            </div>
            <div class="columns medium-3">
              <h4 class="text-center">Armes Secondaires</h4>
              <textarea @change="putSecondaries" @keyup="putSecondaries"></textarea>
            </div>
            <div class="columns medium-3">
              <h4 class="text-center">Armes de mélée</h4>
              <textarea @change="putMelees" @keyup="putMelees"></textarea>
            </div>
          </div>
          <div id="challenge" v-show="display_challenge" class="clearfix">
            <div class="columns small-offset-4 medium-4">
              <h4 class="text-center">Challenges</h4>
              <textarea @change="putChallenges" @keyup="putChallenges"></textarea>
            </div>
          </div>
        </div>
      </section>
      <div class="reveal-modal-bg" style="display: block;"></div>
      <div class="reveal-modal open">
        <h2 class="text-center" id="modalTitle">Que voulez vous de l'outil ?</h2>
        <hr />
        <div class="clearfix type_choice" v-show="!modal_content">
          	<div class="clearfix">
	          	<div class="columns small-4 small-offset-2">
		            <div class="button" @click.prevent="cleanProject">
		              Projet vierge
		            </div>
		        </div>
		        <div class="columns small-4" style="float:left" @click.prevent="fromCache">
		            <div class="button" style="padding-top:25px;">
		              Récuperez mes données des cookies
		            </div>
		        </div>
	        </div>
	        <div class="clearfix">
				<div class="columns small-5 small-offset-4">
					<label>
						<input type="checkbox" v-model="is_empty_challenge_possible" />
						Permettre de ne pas avoir de challenge
					</label>
				</div>
			</div>
	    </div>
        <div class="clearfix" id="input_list" v-show="modal_content">
          <div class="clearfix input_block" v-for="(input, index) in input_list">
            <div class="columns small-4 small-offset-3">
              <input type="text" v-model="input.value" />
            </div>
            <div class="columns small-3" style="float:left">
              <span class="button" v-if="index == input_list.length - 1" @click="addUser"><i class="fa fa-plus"></i></span>
              <span class="button" v-if="input_list.length > 1" @click="removeUser(index, $event)"><i class="fa fa-minus"></i></span>
            </div>
          </div>
          <div class="text-center"><button class="button" @click="saveNames">Sauvegarder</button></div>
          <br />
          <br />
          <div class="callout secondary">
            Les noms en doublon ne seront pris en compte qu'une seule fois
          </div>
        </div>
      </div>
    </div>
    <script src="script.js"></script>
  </body>
</html>
