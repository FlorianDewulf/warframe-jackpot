<!DOCTYPE html>
<html>
  <!-- .php to match on Heroku -->
  <head>
    <title>RandomFrame</title>
    <meta charset="UTF-8"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.3.0/css/foundation.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="style.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.3.0/js/foundation.min.js"></script>
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
            </ul>
          </div>
        </div>
      </header>
      <section class="container">
        <div class="row">
          <div id="tirage" v-show="display_draw">
            <h1 class="text-center">{{ current_user ? current_user.name : '' }} <span class="button tiny" @click.prevent="changeUser"><i class="fa fa-refresh" aria-hidden="true"></i></span></h1>
            <hr />
            <div class="slots" id="slots">
              <div class="text-center">?</div>
              <div class="text-center">?</div>
              <div class="text-center">?</div>
              <div class="text-center">?</div>
            </div>
            <br>
            <div class="text-center"><a href="#" id="hitMe" @click.prevent="roll" class="button">Random</a></div>
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
        </div>
      </section>
      <div class="reveal-modal-bg" style="display: block;"></div>
      <div class="reveal-modal open">
        <h2 class="text-center">Que voulez vous de l'outil ?</h2>
        <hr />
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
        <a class="close-reveal-modal" aria-label="Close">×</a>
      </div>
    </div>
    <script src="script.js"></script>
  </body>
</html>
