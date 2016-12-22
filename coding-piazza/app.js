var CodeSnackApp = angular.module('CodeSnackApp', ['ngMaterial', 'ngMessages', 'ngSanitize']);

CodeSnackApp.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

CodeSnackApp.directive('menuClose', function() {
    return {
        restrict: 'AC',
        link: function($scope, $element) {
            $element.bind('click', function() {
                var drawer = angular.element(document.querySelector('.mdl-layout__drawer'));
                if(drawer) {
                    drawer.toggleClass('is-visible');
                }
                var obfuscator = angular.element(document.querySelector('.mdl-layout__obfuscator'));
                if(obfuscator) {
                    obfuscator.toggleClass('is-visible');
                }
            });
        }
    };
});


CodeSnackApp.controller('CodeSnackCtrl', function($scope, $http) {

	//
	// Lista com todos os exercícios conhecidos
	//
	$scope.exercicios = null;

	//
	// Lista com todas as categorias conhecidas
	//
	$scope.categorias = null;

	//
	// Categoria selecionada
	//
	$scope.categoriaSelecionada = null;

	//
	// Exercício selecionado
	//
	$scope.exercicioSelecionado = null;

	//
	// Preparação do controlador
	//
	$http.get('catalogo.json')
		.then(function(res){
        	$scope.exercicios = res.data;
        	montaCategorias();
        });

	//
	// Monta a lista de categorias a partir dos exercicios
	//
    function montaCategorias() {
     	var numeroExercicios = $scope.exercicios.length;
     	var categorias = [];

		for (var i = 0; i < numeroExercicios; i++) {
			var exercicio = $scope.exercicios[i];
			categorias = registraExercicioCategorias(exercicio, categorias);
		}

		$scope.categorias = categorias;
    }

    //
    // Registra um exercicio em suas categorias
    //
    function registraExercicioCategorias(exercicio, categorias) {
    	var numeroCategorias = exercicio.labels.length;

    	for (var i = 0; i < numeroCategorias; i++) {
    		var categoriaExercicio = exercicio.labels[i];

    		var categoria = pegaCategoria(categoriaExercicio, categorias);

    		if (!categoria) {
    			categoria = { nome: categoriaExercicio, exercicios: [] };
    			categorias.push(categoria);
    		}

    		categoria.exercicios.push(exercicio);
    	}

    	return categorias;
    }

    //
    // Verifica se existe uma categoria em um vetor de categorias
    //
    function pegaCategoria(nome, categorias) {
    	var numeroCategorias = categorias.length;

    	for (var i = 0; i < numeroCategorias; i++) {
    		var categoria = categorias[i];

    		if (categoria.nome == nome)
    			return categoria;
    	}

    	return null;
    }

    //
    // Apresenta a página de lista de categorias
    //
    $scope.listaCategorias = function() {
    	$scope.categoriaSelecionada = null;
    	$scope.exercicioSelecionado = null;
    }

    //
    // Seleciona uma categoria e mostra seus exercícios
    //
    $scope.selecionaCategoria = function(categoria) {
    	$scope.categoriaSelecionada = categoria;
    	$scope.exercicioSelecionado = null;
    }

    //
    // Procura por um texto nos nomes dos exercicios
    //
    $scope.procura = function(texto) {
    	var numeroExercicios = $scope.exercicios.length;
     	var selecionados = [];

    	var textoUpper = texto.toUpperCase();

		for (var i = 0; i < numeroExercicios; i++) {
			var exercicio = $scope.exercicios[i];

			if (exercicio.name.toUpperCase().indexOf(textoUpper) != -1)
				selecionados.push(exercicio);
		}

    	$scope.categoriaSelecionada = { nome: "Procura '" + texto + "'", exercicios: selecionados };
    	$scope.exercicioSelecionado = null;
    }

    //
    // Seleciona um exercício
    //
    $scope.selecionaExercicio = function (exercicio) {
    	$scope.exercicioSelecionado = exercicio;

		if (!$scope.exercicioSelecionado.conteudo) {
		 	$http.get(exercicio.url)
				.then(function(res){
		        	$scope.exercicioSelecionado.conteudo = res.data;
		        });
		}
    }

    //
    // Retorna para a página da lista de exercícios
    //
    $scope.retornaCategoria = function() {
    	$scope.exercicioSelecionado = null;
    }
});