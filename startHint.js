var array_enjoy = [],
	countStep = 0,
	selStep = '',
	arrErr = [],
	enjoyhint = '',
	lastClick = '',
	guide = {
		version: 1,
		url: location.href
	};

alert('1.Для создания шага в сценарии, кликните по элементу, который хотите выделить.\n2.Если вам не нравится, как элемент выделен, нажмите "Нет".Шаг не будет сохранен.\n3.Если выделенная область вас устраивает, нажмите "Да". Шаг сохранится до перезагрузки страницы.\n4.Для отмены составления сценария, нажмите на "Отмена" в диалоге с Ame.\n5.Для сохранения сценария перезагрузите страницу. Сценарий будет сохранен в вашем личном кабинете');
document.addEventListener('click', handler, true);

function handler(e){
	if($(e.target).parent('.enjoyhint').length == 0 && $('.enjoyhint').length == 0){
	    e.stopPropagation();
	    e.preventDefault();
		enjoyhint = new EnjoyHint({ 
			onSkip : function(){
				step = {};
				step.url = location.href;
				step.object = startstep[0].selector;
				step.scrollAnimationSpeed = 151;
				step.onBeforeStart = {};
				step.onBeforeStart.data = "AddCookie(enjoyhint.getCurrentStep());$('html, body').animate({scrollTop: $('"+startstep[0].selector+"').offset().top-150},150);";

		    	array_enjoy[countStep] = step;
		    	countStep += 1;
		    	arrErr = [];
			},
			onEnd : function(){
				//console.log('no');
				//lastClick = '';
			}
		});

		//let classList = e.target.classList;
		selStep = strSelector(e.target);
		startstep = [
	 	{
	 		// "scrollAnimationSpeed" : 151,
	 		// onBeforeStart:function(){
	   //     		$("html, body").animate({scrollTop: $(selStep).offset().top-150}, 150);
	   //     		enjoyhint.stop();
	   //  	},
			"selector":selStep,
			"event":"next",
			"description":"Этот элемент? [Для завершениия обновите страницу]",
			"showNext":true,
			"showSkip":true,
			"skipButton" : 
				{ "text": "Да"},
			"nextButton" : 
				{ "text": "Нет"}
		}
		// ,{
		// 	"onBeforeStart":function(){
	 //       		console.log('no');
	 //       		// arrErr[] += step_data.selector;
	 //       		enjoyhint.resume();
	 //    	},
	 //    	"selector":selStep,
		// 	"event":"next",
		// 	"description":"Этот элемент? [Для завершениия обновите страницу]",
		// 	"showNext":true,
		// 	"showSkip":true,
		// 	"skipButton" : 
		// 		{ "text": "Да"},
		// 	"nextButton" : 
		// 		{ "text": "Нет"}

		// }
		];

		//var enjoyhint = new EnjoyHint({});
		enjoyhint.set(startstep);
		enjoyhint.run();
 	} else if($('.enjoyhint').length != 0 && $(e.target).parent('.enjoyhint').length == 0){
		//Возможность открыть элемент
		lastClick = strSelector(e.target);
		enjoyhint.stop();
	}
}

// window.onbeforeunload = function() {
// 	guide.steps = array_enjoy;

	
// 	// JSON.stringify(guide)
// 	// getBrowserRuntime().sendMessage({exist: true, data: JSON.stringify(guide), end: true}, function(response) {
// 	//   console.log(response.farewell);
// 	// });
// };


function strSelector(target) {
	str = '';

	id = target.id;
	arr = target.classList;
	tag = target.tagName;

	if(id != '' && id != null){
		str = ' #'+ id ;
	}else{
		$.each(arr, function(k, v){
			str += '.'+ v ;
		});
	}
	if(str == ""){
		str = tag;
	}
	if($(str).length > 1 ){
		$.each($(str), function(k, v){
			if($(target)[0] == v) return str+=':eq('+k+')'
		});
	}
	return str;
}