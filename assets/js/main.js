var panelChanging = false,
selfScroll = false,
activeSection = 'first-slide';
vh = 0,
vw = 0,
prevScroll = 0,
isScrolling = false,
canAnimateLogo = false,
lastScrollPosition = 0,
scrollStart = true,
isDragging = false,
staticTimeout = null,
monthes = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
popupVidMouseMove = null,
sectionBlocks = null,
paragraphs = null, sectionTitles = null, lists = null, animateItems = null;

var c = [],
	canvases;
var fps = 60;
var winScrolTop = 0;

var circuitLines = void 0;
var particlesLen = 50;
var canvasBg = 'rgba(4,8,18,1)';
var circutCanvasHeight = 250;
var colors = ['#0E8CDA', '#0ED7DA', '#0EDAA7'];
var radies = [3];
var circuitLinePositions = [
	{
		top: 50,
		path: [{ x: 0, dy: 0 }, { x: 5, dy: -1 }, { x: 10, dy: 0 }, { x: 80, dy: 1 }, { x: 85, dy: 0 }, { x: 100, dy: 0 }]
	}, {
		top: 80,
		path: [{ x: 0, dy: 0 }, { x: 10, dy: -1 }, { x: 15, dy: 0 }, { x: 79, dy: 1 }, { x: 84, dy: 0 }, { x: 100, dy: 0 }]
	}, {
		top: 100,
		path: [{ x: 0, dy: 0 }, { x: 20, dy: -1 }, { x: 25, dy: 0 }, { x: 68, dy: 1 }, { x: 73, dy: 0 }, { x: 100, dy: 0 }]
	}, {
		top: 100,
		path: [{ x: 0, dy: 0 }, { x: 80, dy: 1 }, { x: 85, dy: 0 }, { x: 100, dy: 0 }]
	}, {
		top: 130,
		path: [{ x: 0, dy: 0 }, { x: 100, dy: 0 }]
	}, {
		top: 150,
		path: [{ x: 0, dy: 0 }, { x: 10, dy: 1 }, { x: 12, dy: 0 }, { x: 50, dy: 1 }, { x: 53, dy: 0 }, { x: 60, dy: 0 }, { x: 80, dy: -1 }, { x: 83, dy: 0 }, { x: 100, dy: 0 }]
	}, {
		top: 170,
		path: [{ x: 0, dy: 0 }, { x: 10, dy: 1 }, { x: 17, dy: 0 }, { x: 50, dy: -1 }, { x: 52, dy: 0 }, { x: 60, dy: 0 }, { x: 85, dy: -1 }, { x: 86, dy: 0 }, { x: 100, dy: 0 }]
	}, {
		top: 200,
		path: [{ x: 0, dy: 0 }, { x: 3, dy: 1 }, { x: 8, dy: 0 }, { x: 85, dy: -1 }, { x: 86, dy: 0 }, { x: 100, dy: 0 }]
	}
];


var shieldTimeLine;

// three js

$(function() {

	sectionBlocks = $('section.block');
	// paragraphs = $('p.animate:not(.animated)');
	// sectionTitles = $('.sec-title.animate:not(.animated)');
	// lists = $('ul.animate:not(.animated)');
	animateItems = $('section.block, p.animate, span.animate, .sec-title.animate, ul.animate, video, .shield, .wow')

	shieldTimeLine = new TimelineMax();
	shieldTimeLine.add('start', 0);

	
	$('html, body').animate({
		scrollTop: 0
	}, 0);

	function preventDefault(e) {
	  e = e || window.event;
	  if (e.preventDefault)
		  e.preventDefault();
	  e.returnValue = false;  
	}

	$(".scroll,.scroll-btn").click(function(e) {
		e.preventDefault();
		// $.scrollify.next();
	});
	// setTimeout(function() {
	// 	canAnimateLogo = true;
	// 	$('section.first-slide').removeClass('loading');
	// 	$('#first-slide').addClass('animating')
	// }, 3500)


	var hasHovered = false;
	$(".coffee").on("mouseenter focus",function() {
		if(hasHovered===false) {
			ga('send', 'event', 'Coffee', 'hover', 'Buy me a coffee');
			hasHovered = true;
		}
	});
	var count = 0;
	$(document)
	// .on('click', function(event) {
	// 	$('.ai-chatbox.active:visible').each(function() {
	// 		clicked = $(this);
	// 		console.log((!clicked.is(event.target) && clicked.has(event.target).length === 0))
	// 		if(!clicked.is(event.target) && clicked.has(event.target).length === 0) {
	// 			clicked.removeClass('active').addClass('animating');
	// 			setTimeout(function() {
	// 				clicked.removeClass('animating')
	// 			}, 1000)
	// 		}
	// 	})
	// })
	// .on('click','.page-indicators li, .page-indicators label', function() {
	// 	id = $(this).data('id');
	// 	target= $('section#'+id);
	// 	$('.page-indicators li').removeClass('active');
	// 	$('section').removeClass('fixed-section move-up');
	// 	$(this).addClass('active');

	// 	target.siblings('section.block').removeClass('fixed-section move-up moving-up')
	// 	target.addClass('fixed-section animating').prevAll('section.block').addClass('move-up moving-up');
	// 	setTimeout(function() {
	// 		target.siblings('section.block').removeClass('animating moving-up');
	// 	}, 1000)
	// 	$('section.panel').height(vh);
	// 	target.filter(function() {
	// 		$(this).innerHeight($(this).children('.content-wrapper').innerHeight());
	// 	})
	// 	stickyHeader(id);
	// })
	.on('mousedown','.page-indicators .indicator', function() {
		isDragging = true;
		$(this).addClass('dragging')
	})
	.on('mouseup', function() {
		if(isDragging) {
			isDragging = false;
			$('.page-indicators .indicator').removeClass('dragging')
		} 
	})
	.on('mousemove', '.page-indicators li', function(e) {
		if(isDragging && !$(this).is('.active')) {
			$(this).trigger('click');
			return false;
		}
	})
	
	.on('mousemove', '.user-thumb', function(e) {
		let tSpace = $(this).outerHeight()/2,
			bSpace = tSpace;
			svgW = $(this).outerWidth()/2,
			x = e.offsetX,
			y = e.offsetY,
			sl1 = 0,
			st1 = 1;
		if(x < svgW) {
			sl1 = ((svgW - x)/svgW);
		} else {
			sl1 = ((x - svgW)/svgW) * -1;
		}
		if(y < tSpace) {
			st1 = ((tSpace - y)/tSpace);
		} else {
			st1 = ((y - tSpace)/bSpace) * -1;
		}
		var shadow =  'drop-shadow('+sl1+'px '+st1+'px 0px #0A5583) ';
		shadow += 'drop-shadow('+sl1*2+'px '+st1*2+'px 0px #0A5583) ';
		shadow += 'drop-shadow('+sl1*3+'px '+st1*3+'px 0px #0A4D76) ';
		shadow += 'drop-shadow('+sl1*4+'px '+st1*4+'px 0px #0A4D76) ';
		shadow += 'drop-shadow(0px 0px 5px rgba(14,140,218,0.5)) ';

		$(this).find('.thumb-wrap').css({
			'transform':'rotateY('+sl1*-20+'deg) rotateX('+st1*20+'deg)'
			,'filter':shadow
		});
	})
	.on('mouseout', '.user-thumb', function(e) {
		$(this).find('.thumb-wrap').css({
			'transform':'rotateY(0deg) rotateX(0deg) '
			,'filter':'drop-shadow(0px 0px 0px #6DB9E7)'
		});
	})

	// ai chatting
	.on('click', '.ai-chatbox .ai-thumb', function() {
		$(this).closest('.ai-chatbox').toggleClass('active');
	})
	.on('click', '#start', function(e) {
		e.preventDefault()
		if($.trim($('#clientName').val())) {
			var dt = new Date();
			var dateSaperator = $('<div>',{'class':'date-saperator'}).append(dt.getDate() + ' ' + monthes[dt.getMonth()] + ', ' + dt.getFullYear());

			$('.ai-chatbox .chat-body').append(dateSaperator);
			var msg = 'Hello ' + $.trim($('#clientName').val()) + '! How may I help you?';

			addChatMsg(msg,'ai-msg');
			$(this).closest('.ai-startup').hide().siblings('.chat-wrapper').fadeIn();
		} else {
			$('#clientName').addClass('error');
		}
	})
	.on('click', '#skip', function(e) {
		e.preventDefault()
		var dt = new Date();
		var dateSaperator = $('<div>',{'class':'date-saperator'}).append(dt.getDate() + ' ' + monthes[dt.getMonth()] + ', ' + dt.getFullYear());

		$('.ai-chatbox .chat-body').append(dateSaperator);
		var msg = 'Hello! How may I help you?';

		addChatMsg(msg,'ai-msg');
		$(this).closest('.ai-startup').hide().siblings('.chat-wrapper').fadeIn();
	})
	.on('keypress', '#chatMsg', function(e) {
		if(e.keyCode == 13) {
			if(!e.shiftKey) {
				$('#sendMsg').trigger('click');
				return false;
			}
		}
	})
	.on('click', '#sendMsg', function(e) {
		e.preventDefault()
		if($.trim($('#chatMsg').val())) {
			addChatMsg($.trim($('#chatMsg').val()),'user-msg');
			$('#chatMsg').val('')
		}
	})

	// video popup
	.on('click', 'main .video-wrapper .maximize-video', function() {
		$vid_wrapper = $(this).closest('.video-wrapper');
		var popup = $('.popup-player');

		wrapper = $vid_wrapper.parent();
		var videoContainer = $('.popup-player .video-container');

		$vid_wrapper.find('video').get(0).pause();
		var playTime = $vid_wrapper.find('video').get(0).currentTime;

		var videoWrap = $vid_wrapper.clone(true);
		videoWrap.removeClass('zoomed');
		videoWrap.find('.maximize-video, .play-button, .controls-strip').remove();
		videoWrap.find('video').get(0).currentTime = playTime;
		videoWrap.prepend($('<div>',{'class':'play-button playing'}))

		popup.data('target',$vid_wrapper.parent()).fadeIn(50, function() {
			$(this).addClass('show')
			videoContainer.find('.video-wrapper').addClass('no-transform')
		});

		videoContainer.css({
			'width': wrapper.width(),
			'height': wrapper.height()
		}).offset({
			'top': wrapper.offset().top,
			'left':wrapper.offset().left
		}).empty().append(videoWrap).find('video').removeAttr('style');

		TweenMax.to($vid_wrapper, 0.3, {css:{opacity:0}}, 'start')

		var t1 = new TimelineMax();
		t1.add('start', 0.2)
		.fromTo(videoContainer, 0.5, {css:{transform:wrapper.css('transform')}}, {css:{left:50, top:50, width:vw-100, height:vh-100, transform:'matrix(1, 0, 0, 1, 0, 0)'}}, 'start')
		// .to(popup, 0.3, {css:{backgroundColor:'rgba(0,0,0,0.95)'}}, 'start')

		videoContainer.find('video').get(0).play();
	})
	.on('click', '.popup-player .close-popup', function() {
		var popup = $(this).closest('.popup-player');
		var target = popup.data('target');
		
		popup.find('video').get(0).pause()
		videoContainer = popup.find('.video-container');
		videoContainer.find('.video-wrapper').removeClass('no-transform')
		var t1 = new TimelineMax({
			onComplete: function() {
				target.find('video').get(0).currentTime = popup.find('video').get(0).currentTime;
				if(target.find('video').is('.pauseOnBlur')) {
					target.find('video').get(0).pause()	
				} else {
					target.find('video').get(0).play();
				}
				// target.find('.play-button').length ? target.find('.play-button').removeClass('playing') : '';
				popup.fadeOut(400, function() {
					popup.find('.video-container').empty();
				});
			}
		});
		// console.log(target.find('.video-wrapper').innerWidth())
		// console.log(target.find('.video-wrapper').outerWidth())
		t1.add('start', 0)
		.to(videoContainer, 0.5, {css:{left:target.offset().left, top:(target.offset().top - $(window).scrollTop()), width:target.width(), height:target.height(), transformOrigin:'top left', transform:target.css('transform')}}, 'start')
		.to(target.find('.video-wrapper'), 0.3, {autoAlpha:1,padding:(target.find('.video-wrapper').innerWidth() - target.find('.video-wrapper').width())/2})
		// .to(popup, 0.3, {css:{backgroundColor:'rgba(0,0,0,0)'}}, 'start')
	})
	.on('mousemove', '.video-wrapper', function() {
		// var vidWrap = $(this).parent();
		// var playBtn = $(this).siblings('.play-button');

		// if(playBtn.is('.playing')) {
		// 	vidWrap.removeClass('hoverHidden')
		// 	popupVidMouseMove = setTimeout(function() {
		// 		clearTimeout(popupVidMouseMove);
		// 		if(playBtn.is('.playing')) {
		// 			vidWrap.addClass('hoverHidden');
		// 		}
		// 	}, 2000)
		// } else {
		// 	vidWrap.removeClass('hoverHidden')
		// }
		autoHidePlayBtn($(this).find('video'))
	})
	.on('click', '.play-button:not(.maximize-video)', function() {
		var video = $(this).closest('.video-wrapper').find('video').get(0)
		var btn = $(this);
		if($(this).parent().is('.controls')) {
			btn = $(this).closest('.controls-strip')
		}
		if(video.paused) {
			video.play();
			btn.addClass('playing');
		} else {
			video.pause();
			btn.removeClass('playing')
		}

		// if($(this).is('.popup-player .play-button')) {
			// var vidWrap = $(this).parent();
			autoHidePlayBtn(video)
		// }
	})
	.on('click', '.first-slide .video-slide .play_video', function(e) {
		e.stopPropagation();
		$(this).siblings('.video-container').find('.maximize-video').trigger('click');
	})
	.on('click', 'a[href="#"]', function(e) {
		e.preventDefault();
	})
	.on('mousemove', '.btn.trackBg', function(e) {
		var offset = $(this).offset();
		$(this).find('.bg').css({
			'transform':'translateX('+(e.clientX - offset.left)+'px) translateY('+ (e.clientY - (offset.top - $(window).scrollTop())) + 'px)'
		})
	})
	// .on('mouseover', '.api-container li, .api-container .logo', function() {
	// 	var x1 = $(this).offset().left;
	// 	var y1 = $(this).offset().top;

	// 	$(this).closest('.api-container').addClass('hovered');

	// 	$(this).siblings('li, .logo').each(function() {
	// 		var x2 = $(this).offset().left;
	// 		var y2 = $(this).offset().top;
	// 		var dist = distance(x1, y1, x2, y2);
	// 		if(dist <= 300) {
	// 			$(this).addClass('siblingHover')
	// 		}
	// 	})
	// })
	// .on('mouseleave', '.api-container li, .api-container .logo', function() {
	// 	$(this).closest('.api-container').removeClass('hovered');
	// 	$(this).siblings('li, .logo').each(function() {
	// 		$(this).removeClass('siblingHover')
	// 	})
	// })


	$(window)
	.on('resize', function() {
		vh = $(window).innerHeight();
		vw = $(window).innerWidth();

		if(canvases) {
			canvases.each(function(i, canvas) {
				canvas.width = window.innerWidth;
				canvas.height = circutCanvasHeight;
			})
		}

		if($('.ai-chatbox').length) {
			var aiTop = $('.ai-chatbox').offset().top,
			aiWidth = $('.ai-chatbox').outerWidth(),
			maxBottom = (vh - aiWidth - 20);

			aiTop = aiTop < 20 ? 20 : aiTop;
			aiTop = aiTop > maxBottom ? maxBottom : aiTop;
			aiLeft = $('.ai-chatbox').is('.left') ? 20 : (vw - aiWidth - 20);
			$('.ai-chatbox').css({
				'top': aiTop,
				'left': aiLeft
			})
		}
		setJoiningSecHei();
	})

	// scroll event
	.on('scroll', function(e) {
		scrollTop = $(window).scrollTop();
		if(scrollTop > 100) {
			$('header').addClass('sticky');
		} else {
			$('header').removeClass('sticky');
		}

		if(checkVisible($('section.block.first-slide .slide-logo')) || checkVisible($('.eleventh-slide .logo'))) {
			$('header.haeader-panel .logo').removeClass('show')
		} else {
			$('header.haeader-panel .logo').addClass('show')
		}

		if(Math.abs(scrollTop - lastScrollPosition) >= 250) {
			lastScrollPosition = scrollTop;

			if($('main').is('.movedUp')) {
				var tl = new TimelineMax({
					onComplete: function() {
						enableScroll();
						$('main').removeClass('movedUp')
					}
				})
				TweenMax.to($('main'), 0.3, {y:0})
			}

			if(!$('body').is('.initializing')) {
				animateItems.each(function() {
					// if(checkVisible($(this)) && $(this).is('.animate') && !$(this).data('animated')) {
					// 	// $(this).data('animated',true).addClass('animated');

					// 	// if($(this).is('p, span')) {
					// 	// 	if($(this).is('.lineAnimation')) {
					// 	// 		var lines = new SplitText($(this), {type:"lines"});
					// 	// 		data = $(this).data();
					// 	// 		animateList(lines.lines, data.direction, data.delay, parseInt($(this).css('line-height').replace(/px/g)));
					// 	// 	} else {
					// 	// 		// animateSecTitle($(this), 0.5, 0.02);
					// 	// 	}
					// 	// } else if ($(this).is('.sec-title')) {
					// 	// 	animateSecTitle($(this));
					// 	// } else if($(this).is('ul')) {
					// 	// 	data = $(this).data();
					// 	// 	animateList($(this).find('li'), data.direction, data.delay, $(this).find('li:first-child').outerHeight(true));
					// 	// }
					// } else 
					if($(this).is('section.block')) {
						if(checkVisible($(this))) {
							if(!$(this).is('.animating')) {
								$(this).addClass('animating');
								if(vw > 992) {
									if(!$(this).data('loaded')) {
										$(this).data('loaded',true).addClass('loaded')

										if($(this).is('#second-slide')) {
											$('html, body').animate({
												scrollTop: $(this).offset().top
											}, 1000);
											animateSecondSlide();
										} else if($(this).is('#third-slide')) {
											$('html, body').animate({
												scrollTop: $(this).offset().top + 250
											}, 1000);
											animateThirdSlide();
										} else if($(this).is('#forth-slide')) {
											animateFourthSlide();
										} else if($(this).is('#fifth-slide')) {
											$('html, body').animate({
												scrollTop: $(this).offset().top
											}, 1000);
											animateFifthSlide();
										} else if($(this).is('#sixth-slide')) {
											animateSixthSlide();
										} else if($(this).is('#seventh-slide')) {
											$('html, body').animate({
												scrollTop: $(this).offset().top + ((vw/100) * 12)
											}, 1000);
											animateSeventhSlide();
										} else if($(this).is('#eighth-slide')) {
											animateEighthSlide();
										} else if($(this).is('#ninth-slide')) {
											animateNinthSlide();
										} else if($(this).is('#eleventh-slide')) {
											$('html, body').animate({
												scrollTop: $(this).offset().top + 250
											}, 1000);
											animateEleventhSlide();
										}
									}
								}
							}
						} else {
							if($(this).is('.animating')) {
								$(this).removeClass('animating')
							}
						}
					} else if ($(this).is('video')) {
						if(checkVisible($(this)) && !$(this).is('.pauseOnBlur')) {
							$(this).get(0).play();
						} else {
							$(this).get(0).pause();
						}
					} else if ($(this).is('.shield')) {
						if(checkVisible($(this))) {
							shieldTimeLine.play();
						} else {
							shieldTimeLine.pause();
						}
					}
				})
			}
		}

	})
	.on('mousewheel', function(e) {
		// console.log(e.deltaY)
		if($('html').scrollTop() == $('html').innerHeight() - window.innerHeight && e.deltaY < 0) {
			// console.log('show footer')
			$('main').addClass('movedUp')
			disableScroll();
			// console.log($('footer').innerHeight())
			TweenMax.to($('main'), 0.5, {y:-$('footer').innerHeight()})
		} else if (e.deltaY > 0 && $('main').is('.movedUp')) {
			// console.log('hide footer');
			var tl = new TimelineMax({
				onComplete: function() {
					enableScroll();
					$('main').removeClass('movedUp')
				}
			})
			TweenMax.to($('main'), 0.5, {y:0})

		}
	})

	$('[data-wow-duration]').each(function() {
		$(this).css('animation-duration',$(this).data('wow-duration'))
	})
	$('[data-wow-delay]').each(function() {
		$(this).css('animation-delay',$(this).data('wow-delay'))
	})
	var scrollTop = $(window).scrollTop();
	vh = $(window).innerHeight();
	vw = $(window).innerWidth();
	setTimeout(function() {
		panelChanging = true;
		isScrolling = true;
		$('html, body').scrollTop(0)
		$('section.block.first-slide').addClass('visible');
	}, 200)

	// $('.section-body').mCustomScrollbar({
	// 	theme:"minimal",
	// 	mouseWheel:{scrollAmount:500,normalizeDelta:true}
	// });

	$( ".ai-chatbox" ).draggable({
		handle: ".ai-thumb",
		start: function(event, ui) {
			$(event.target).addClass('moving');
		},
		stop: function(event, ui) {
			let winWid = $(window).innerWidth(),
			winHei = $(window).innerHeight(),
			left = 0,
			top = event.target.offsetTop,
			direction = 'right',
			thumbPosition = 'bottom';
			if(event.target.offsetLeft < winWid/2) {
				left = 20;
				direction = 'left';
			} else {
				direction = 'right';
				left = winWid - event.target.offsetWidth - 20;
			}
			if(event.target.offsetTop < winHei/2) {
				thumbPosition = 'upper'
			}
			thumbPosition = event.target.offsetTop < winHei/2 ? ' upper' : ' bottom';
			top = top < 20 ? 20 : top;
			top = top > (winHei - 80) ? (winHei-80) : top;
			$(event.target).removeClass('left right upper bottom').addClass(direction+thumbPosition).animate({
				'left': left,
				'top': top
			}, 300, function() {
				$(event.target).removeClass('moving');
			});
		}
	});

	// shield animation
	if($('svg .line').length) {
		$('svg .line').each(function() {
			var offset = eval($(this).css('stroke-dasharray').replace(/[,]\s/g, '+').replace(/px/g,'')) * -1;
			// if($(this).parent().is('.right-lines')) {
			// 	offset *= -1;
			// 	console.log('a')
			// }
			duration = parseFloat($(this).css('animation-duration'));
			// console.log(offset)

			shieldTimeLine.fromTo($(this), duration, {css:{strokeDashoffset:0}}, {css:{strokeDashoffset:offset},  ease:Power0.easeNone, repeat:-1}, 'start');
		})
	}

	setJoiningSecHei();

	// canvases = $('.circuitlines');
 //    canvases.each(function(i, canvas) {
 //        c.push(canvas.getContext('2d'));
 //        canvas.width = window.innerWidth;
 //        canvas.height = 250;
 //    })
 //    initCircutlines();
 //    animateCircutlines();

	// setTimeout(function() {
	// 	$('#first-slide').addClass('animating')
	// }, 150)

});

function addChatMsg(_msg,clss) {
	var dt = new Date();
	var ampm = dt.getHours() >= 12 ? 'pm' : 'am';
	var h = dt.getHours();
	h = h > 12 ? h%12 : h;
	var msgTime = h +':'+ dt.getMinutes() + ' ' + ampm;
	var msg = $('<div>',{'class':'chat-msg '+clss,'style':'display:none'});
	msg.append(_msg);
	msg.append($('<span>',{'class':'msg_time'}).append(msgTime));
	$('.ai-chatbox .chat-body').append(msg);
	msg.fadeIn();
}

function stickyHeader(secId) {
	id = $('section.fixed-section').attr('id');
	// setTimeout(function() {
		$(window).scrollTop(0);
	// }, 1000)
	if($('.first-section').is('.fixed-section')) {
		$('header').removeClass('sticky').removeAttr('data-bg');
	} else {
		$('header').addClass('sticky').attr('data-bg',id);
	}
	moveIndicator(secId);
}

function moveIndicator(secId) {
	$('.page-indicators li').removeClass('active');
	$('.page-indicators li[data-id='+secId+']').addClass('active');
	$('.page-indicators .indicator').offset({'top': $('.page-indicators li[data-id='+secId+']').offset().top})
}

var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
	  e.preventDefault();
  e.returnValue = false;  
}

function disableScroll() {
  if (window.addEventListener) // older FF
	  window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  // document.onkeydown  = preventDefaultForScrollKeys;
  // console.log('scroll disabled')
}
disableScroll();

function enableScroll() {
	if (window.removeEventListener)
		window.removeEventListener('DOMMouseScroll', preventDefault, false);
	window.onmousewheel = document.onmousewheel = null; 
	window.onwheel = null; 
	window.ontouchmove = null;  
	document.onkeydown = null;  
	// console.log('scroll enabled')
}

function pauseEvent(e){
	if(e.stopPropagation) e.stopPropagation();
	if(e.preventDefault) e.preventDefault();
	e.cancelBubble=true;
	e.returnValue=false;
	return false;
}



// utility functions
function randomIntFromRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomValFromArray(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function Particle(x, radius, color, dx, positions, c) {
	this.x = x;
	this.dx = dx;
	this.dy = 0;
	this.radius = radius;
	this.color = color;
	this.radians = Math.random() * Math.PI * 2;
	this.mass = 1;
	this.alpha = 1;
	this.inRadius = false;
	this.positions = positions.path;
	this.c = c;
	this.path = [];

	if(dx > 0) {
		this.position = 0;
	} else {
		this.position = this.positions.length - 1;
	}

	this.staticY = positions.top;
	let topAb = 0;
	if(dx < 0) {
		for(var i=0; i<this.positions.length; i++) {
			if(this.positions[i].dy != 0) {
				if(this.positions[i+1]) {

					let r = (this.positions[i+1].x - this.positions[i].x);
					let hyp = r/(Math.cos(Math.PI*r)/6);
					let top = Math.sqrt(Math.pow(hyp, 2) - Math.pow(r, 2));
					if(this.positions[i].dy < 0) {
						top *= -1;
					}
					topAb += top;
				}
			}
		}
		this.staticY = positions.top + topAb;
	}
	this.y = this.staticY;

	var pathLen = Math.floor(Math.abs(dx * 2));
	if(Math.abs(dx) < 2) {
		pathLen = Math.floor(Math.abs((dx + 10) * 10));
	} else if (Math.abs(dx) > 10) {
		pathLen = Math.floor(Math.abs(dx));
	}
	for(var i = 0; i < pathLen; i++) {
		this.path.push({x:this.x, y:this.staticY});
	}

	this.update = function (c) {
		let bottPos = c.canvas.offsetTop + c.canvas.clientHeight;
		// if(this.c == c && $(c.canvas).closest('section.block').is('.animating')) {
			if(this.dx > 0) {
				if(this.positions[this.position]) {
					if(this.x >= (this.positions[this.position].x * innerWidth)/100 ) {
						if(this.positions[this.position].dy < 0) {
							this.dy = -(this.dx * 0.5);
						} else if (this.positions[this.position].dy == 0) {
							this.dy = 0;
						} else {
							this.dy = this.dx * 0.5;
						}
						this.position++;
					}
				} else {
					this.position = 0;
					this.x = -(this.positions[this.position].x + 20);
					this.y = this.staticY;
				}
			} else {
				if(this.x < this.radius) {
					this.x = innerWidth + this.radius;
					this.position = this.positions.length - 1;
					this.y = this.staticY;
				}
				if(this.positions[this.position]) {
					if(this.x <= (this.positions[this.position].x * innerWidth)/100 ) {
						if(this.positions[this.position - 1].dy < 0) {
							this.dy = -(this.dx * 0.5);
						} else if (this.positions[this.position - 1].dy == 0) {
							this.dy = 0;
						} else {
							this.dy = (this.dx * 0.5);
						}
						this.position--;
					}
				} else {
					this.position = this.positions.length - 1;
					this.x = this.positions[this.position].x + 20;
					this.y = this.staticY;
				}
			}
			let lastPoint = {x: this.x, y: this.y};
			
			this.x += this.dx;
			this.y += this.dy;

			this.path.splice(0,1);
			this.path.push({x:this.x, y:this.y});
			this.draw(lastPoint, c);
		// }
	};

	this.draw = function (lastPoint, c) {
		let alpha = 1/this.path.length;
		let path = this.path;
		for(var i =0; i< path.length; i++) {
			c.beginPath();
			c.save();
			c.globalAlpha = alpha*i;
			c.strokeStyle = this.color;
			c.lineWidth = this.radius;
			// c.shadowColor = 'red';
			// c.shadowOffsetX = 0;
			// c.shadowOffsetY = 0;
			// c.shadowBlur  = 1;
			if(i > 0) {
				if(this.dx < 0) {
					if(path[i-1].x > path[i].x) {
						c.moveTo(path[i-1].x, path[i-1].y);
					} else {
						c.moveTo(path[i].x, path[i].y);
					}
					c.lineTo(path[i].x, path[i].y);
				} else {
					if(path[i-1].x < path[i].x) {
						c.moveTo(path[i-1].x, path[i-1].y);
					} else {
						c.moveTo(path[i].x, path[i].y);
					}
					c.lineTo(path[i].x, path[i].y);
				}
			} else {
				c.moveTo(path[i].x, path[i].y);
				c.lineTo(path[i].x, path[i].y);
			}

			c.stroke();
			c.restore();
			c.closePath();
		}
	};
}


function initCircutlines() {
    circuitLines = [];
    for(var i = 0; i < c.length; i++) {
        for (var j = 0; j < particlesLen; j++) {
            var dx = 0;
            var radius = randomIntFromRange(1, 6);
            var x = Math.random() * innerWidth;
            var y = Math.random() * 50 + 200;
            dx = (Math.random() - 0.5) * 30;
            dx < 0 ? dx-- : dx++;
            y = 100;
            randomValFromArray(positions);
            circuitLines.push(new Particle(x, randomValFromArray(radies), randomValFromArray(colors), dx, randomValFromArray(circuitLinePositions), c[i]));
        }
    }
}


function animateCircutlines() {
	requestAnimationFrame( animateCircutlines );
    // setTimeout(function() {
        // i++;
        for(var i = 0; i < c.length; i++) {
            c[i].clearRect(0, 0, innerWidth, innerHeight);
            circuitLines.forEach(particle => {
                particle.update(c[i]);
            });
        }
        // loop();
    // }, 1000/fps)
}

function autoHidePlayBtn(video) {
	var vidWrap = video.closest('.video-wrapper');
	var playBtn = vidWrap.find('.play-button');

	if(playBtn.is('.playing')) {
		vidWrap.removeClass('hoverHidden')
		clearTimeout(popupVidMouseMove);
		popupVidMouseMove = setTimeout(function() {
			if(playBtn.is('.playing')) {
				vidWrap.addClass('hoverHidden');
			}
		}, 2000)
	} else {
		vidWrap.removeClass('hoverHidden')
	}
}

function distance(x1, y1, x2, y2) {
    var xDist = x2 - x1;
    var yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}



function animateSecondSlide() {
	var tl = new TimelineMax({
		onComplete: function() {
			backToText($('.second-slide .sub-title'))
			backToCss($('.boxes'))
		}
	});
	var desc = new SplitText($('.second-slide .sub-title'), {type:"words,chars"});
	chars = desc.chars;

	tl
	.staggerFrom(chars, 0.6, {opacity:0, scale:0, y:80, rotationX:180, transformOrigin:"0% 50% -50", ease:Bounce.easeOut}, 0.02, "+= 1")
	.add('start')
	.staggerFromTo($('.boxes.odd'), 1, {x:500, autoAlpha:0}, {x:0, autoAlpha:1},1.6, 'start')
	.staggerFromTo($('.boxes.even'), 1, {x:-500, autoAlpha:0}, {x:0, autoAlpha:1}, 1.6, 'start+=0.8')
	.staggerFromTo($('.boxes.odd .thumb-wrap'), 0.5, {scale:0}, {scale:1}, 1.6, 'start+=0.4')
	.staggerFromTo($('.boxes.even .thumb-wrap'), 0.5, {scale:0}, {scale:1}, 1.6, 'start+=1.2')
	.staggerFromTo($('.boxes.odd .hand1 .path'), 0.4, {css:{strokeDashoffset:710}}, {css:{strokeDashoffset:0}}, 1.6, 'start+=0.8')
	.staggerFromTo($('.boxes.odd .hand2 .path'), 0.4, {css:{strokeDashoffset:690}}, {css:{strokeDashoffset:0}}, 1.6, 'start+=1.1')
	.staggerFromTo($('.boxes.even .hand1 .path'), 0.4, {css:{strokeDashoffset:710}}, {css:{strokeDashoffset:0}}, 1.6, 'start+=1.6')
	.staggerFromTo($('.boxes.even .hand2 .path'), 0.4, {css:{strokeDashoffset:690}}, {css:{strokeDashoffset:0}}, 1.6, 'start+=1.9')
}

function animateThirdSlide() {
	var tl = new TimelineMax({
		onComplete: function() {
			backToText($('.third-slide .sec-title, .third-slide .secure-cont p,.third-slide .animatedTitle span'))
			backToCss($('.backdor, .backdor-shield, .third-slide .sec-title, .third-slide p'))
		}
	});
	
	var txt = $('.third-slide .secure-cont p').text();
	$('.third-slide .secure-cont p').empty().append(txt);
	var mainTitle1 = new SplitText($('.third-slide .animatedTitle .subTitle span'), {type:"words,chars"})
	var mainTitle2 = new SplitText($('.third-slide .animatedTitle .mainTitle span'), {type:"words,chars"})

	var title = new SplitText($('.third-slide .sec-title'), {type:"words,chars"})
	var desc = new SplitText($('.third-slide .secure-cont p'), {type:"lines"})
	$('.third-slide .secure-cont p').empty().append(desc.lines);

	tl
	.fromTo('.third-slide .animatedTitle', 0.5, {autoAlpha:0}, {autoAlpha:1, delay:3})
	.staggerFromTo(mainTitle1.chars, 0.5, {scale:0, x:80, rotateY:180}, {scale:1, x:0, rotateY:0, transformOrigin:"0% 50% -50", ease:Back.easeOut}, 0.05, 'start')
	.staggerFromTo(mainTitle2.chars, 0.5, {scale:0, x:-80, rotateY:180}, {scale:1, x:0, rotateY:0, transformOrigin:"0% 50% -50", ease:Back.easeOut}, 0.05)
	.call(function() {
		$('.third-slide .animatedTitle').addClass('animating')
	})
	.staggerFromTo($('.backdor-shield'), 1, {opacity:0}, {opacity:1}, '-=0.3')
	.staggerFromTo($('.third-slide .sec-title, .third-slide p'), 0.3, {autoAlpha:0}, {autoAlpha:1}, 0, '-=1')
	.staggerFrom(title.chars, 0.6, {autoAlpha:0, scale:3, x:-10}, 0.05, "-=0.5")
	.add('stagger')

	setTimeout(function() {
		$('.third-slide .secure-cont p').children().each(function(i) {
			var chars = new SplitText($(this), {type:'chars'});
			var delay = i > 0 ? "-=1.5" : "+=0"
			tl.staggerFrom(chars.chars, 0.7, {autoAlpha:0, scale:2, y:-60, ease:Back.easeOut}, 0.02, delay)
		})
	}, 100)
}

function animateFourthSlide() {
	var tl = new TimelineMax({
		onComplete: function() {
			backToText($('.fourth-slide .sec-title, .fourth-slide .automate-cont span'));
			backToCss($('.fourth-slide .automate-cont ul li, .fourth-slide .video-container'))
		}
	});
	var title = new SplitText($('.fourth-slide .sec-title'), {type:"words,chars"});
	var subTitle = new SplitText($('.fourth-slide .automate-cont span'), {type:"words,chars"});

	tl
	.fromTo($('.fourth-slide .video-container'), 1, {autoAlpha:0}, {autoAlpha:1, delay:1})
	.staggerFrom(title.chars, 0.6, {opacity:0, scale:3, x:-10}, 0.05, "-=0.5")
	.staggerFrom(subTitle.chars, 0.7, {opacity:0, scale:2, y:-60, ease:Back.easeOut}, 0.02, "-=0.5")
	.staggerFromTo($('.fourth-slide .automate-cont ul li'), 0.7, {opacity:0, y:-$('.fourth-slide .automate-cont ul li:first-child').outerHeight(true)}, {opacity:1, y:0, ease:Back.easeOut}, 0.1, "-=0.5")
}

function animateFifthSlide() {
	var tl = new TimelineMax({
		onComplete: function() {
			backToText($('.fifth-slide .sec-title'));
			backToCss($('.fifth-slide .automate-cont ul li, .fifth-slide .video-container'))
		}
	});
	var title = new SplitText($('.fifth-slide .sec-title'), {type:"words,chars"});
	// var hei = $('.fifth-slide').innerHeight();
	// var tl2 = new TimelineMax();
	// tl2.staggerFromTo($('.fifth-slide .gooye-bg .ball'), 5, {y:0}, {top:"100%", repeat:-1}, 1)

	MorphSVGPlugin.convertToPath(".fifth-slide .bgi .bg1, .fifth-slide .bgi .bg2, .fifth-slide .bgi .ribbon, .fifth-slide .bgi .fullBg")

	tl
	.to('.fifth-slide .bgi .whiteBg', 0.7, {morphSVG:{shape:'.fifth-slide .bgi .bg1Final'}, delay:2})
	.to('.fifth-slide .bgi .bg1', 0.7, {morphSVG:{shape:'.fifth-slide .bgi .bg1Final'}, delay:-0.3})
	// .to('.fifth-slide .bgi .bg1', 1.5, {morphSVG:{shape:'.fifth-slide .bgi .bg1final'}, delay:-1})
	// .fromTo('.fifth-slide .joining-section', 0.1, {autoAlpha:0}, {autoAlpha:1, delay:-1})
	.to('.fifth-slide .bgi .bg3', 1, {morphSVG:{shape:'.fifth-slide .bgi .bg3Final'}})
	.to('.fifth-slide .bgi .bg2', 2, {morphSVG:{shape:'.fifth-slide .bgi .bg2Final'}, css:{fill:'#14161C'}})
	// .to('.fifth-slide .bgi .bg2', 2, {morphSVG:{shape:'.fifth-slide .bgi .bg2final'}, delay:-1})
	.fromTo($('.fifth-slide .video-container'), 0.8, {opacity:0, x:$('.fifth-slide .video-container').width()}, {opacity:1, x:0, delay:-1.5})
	.staggerFrom(title.chars, 0.5, {opacity:0, scale:3, x:-10}, 0.05, "-=0.5")
	.staggerFromTo($('.fifth-slide .automate-cont ul li'), 0.7, {opacity:0, y:-$('.fifth-slide .automate-cont ul li:first-child').outerHeight(true)}, {opacity:1, y:0, ease:Back.easeOut}, 0.1, "-=0.5")
}

function animateSixthSlide() {
	var tl = new TimelineMax({
		onComplete: function() {
			backToText($('.sixth-slide .sec-title'));
			backToCss($('.sixth-slide .automate-cont ul li, .sixth-slide .mobile-frame'))
		}
	});
	var title = new SplitText($('.sixth-slide .sec-title'), {type:"words,chars"});

	tl
	.fromTo($('.sixth-slide .mobile-frame'), 0.8, {opacity:0, x:-$('.sixth-slide .mobile-frame').width()}, {opacity:1, x:0, delay:1})
	.staggerFrom(title.chars, 0.5, {opacity:0, scale:3, x:-10}, 0.05, "-=0.5")
	.staggerFromTo($('.sixth-slide .automate-cont ul li'), 0.7, {opacity:0, y:-$('.sixth-slide .automate-cont ul li:first-child').outerHeight(true)}, {opacity:1, y:0, ease:Back.easeOut}, 0.1, "-=0.5")
}

function animateSeventhSlide() {
	var tl = new TimelineMax({
		onComplete: function() {
			backToText($('.seventh-slide .sec-title'));
			backToCss($('.seventh-slide .secure-cont ul li, .seventh-slide .video-container'))
		}
	});
	var title = new SplitText($('.seventh-slide .sec-title'), {type:"words,chars"});
	var j = 0;
	tl
	.add('start', 2)
	$('.seventh-slide .svg-wrap g').each(function() {
		var i = 0;
		$(this).find('path').each(function() {
			var delay = i * 0.15 + j/4;
			tl.to($(this), 0.8, {morphSVG:$(this).data('original'), fill:'#623FDF', delay: delay}, 'start')
			i++;
		})
		j++;
	})
	
	tl.from('.joining-section.sixth-seventh .before', 1, {y:"-100%"})
	.from('.joining-section.seventh-eighth .after', 1, {y:"100%", delay:-0.8})
	.from('.joining-section.seventh-eighth .before', 1, {y:"100%", delay:-0.8})
	.fromTo($('.seventh-slide .video-container'), 0.8, {opacity:0, x:$('.seventh-slide .video-container').width()}, {opacity:1, x:0})
	.staggerFrom(title.chars, 0.5, {opacity:0, scale:3, x:-10}, 0.05, "-=0.5")
	.staggerFromTo($('.seventh-slide .secure-cont ul li'), 0.7, {opacity:0, y:-$('.seventh-slide .secure-cont ul li:first-child').outerHeight(true)}, {opacity:1, y:0, ease:Back.easeOut}, 0.1, "-=0.5")
}

function animateEighthSlide() {
	var tl = new TimelineMax({
		onComplete: function() {
			backToText($('.eighth-slide .sec-title'));
			backToCss($('.eighth-slide .secure-cont ul li, .eighth-slide .video-container'))
		}
	});
	var title = new SplitText($('.eighth-slide .sec-title'), {type:"words,chars"});

	tl
	.fromTo($('.eighth-slide .video-container'), 0.8, {opacity:0, x:-$('.eighth-slide .video-container').width()}, {opacity:1, x:0, delay:1})
	.staggerFrom(title.chars, 0.5, {opacity:0, scale:3, x:-10}, 0.05, "-=0.5")
	.staggerFromTo($('.eighth-slide .secure-cont ul li'), 0.7, {opacity:0, y:-$('.eighth-slide .secure-cont ul li:first-child').outerHeight(true)}, {opacity:1, y:0, ease:Back.easeOut}, 0.1, "-=0.5")
}

function animateNinthSlide() {
	var tl = new TimelineMax({
		onComplete: function() {
			backToText($('.ninth-slide .sec-title, .ninth-slide .automate-cont span'));
			backToCss($('.ninth-slide .automate-cont ul li, .ninth-slide .video-container'))
		}
	});
	var title = new SplitText($('.ninth-slide .sec-title'), {type:"words,chars"});
	var subTitle = new SplitText($('.ninth-slide .automate-cont span'), {type:"words,chars"});

	tl
	.fromTo($('.ninth-slide .video-container'), 0.8, {opacity:0, x:$('.ninth-slide .video-container').width()}, {opacity:1, x:0, delay:1})
	.staggerFrom(title.chars, 0.5, {opacity:0, scale:3, x:-10}, 0.05, "-=0.5")
	.staggerFrom(subTitle.chars, 0.7, {opacity:0, scale:2, y:-60, ease:Back.easeOut}, 0.02, "-=0.5")
	.staggerFromTo($('.ninth-slide .automate-cont ul li'), 0.7, {opacity:0, y:-$('.ninth-slide .automate-cont ul li:first-child').outerHeight(true)}, {opacity:1, y:0, ease:Back.easeOut}, 0.1, "-=0.5")
}

function animateEleventhSlide() {
	var tl = new TimelineMax({
		onComplete: function() {
			backToText($('.eleventh-slide .sec-title'));
			backToCss($('.eleventh-slide .api-container ul li'))
			$('.eleventh-slide .api-container ul li').addClass('animated')
			$('#eleventh-slide').addClass('loaded')
		}
	});
	var title = new SplitText($('.eleventh-slide .sec-title'), {type:"words,chars"});
	$('#eleventh-slide').removeClass('loaded')

	tl
	.staggerFrom(title.chars, 0.5, {opacity:0, scale:3, x:-10, delay:1}, 0.05)
	.fromTo($('.eleventh-slide .brand-logo svg'), 1, {css:{strokeDashoffset:-120}}, {css:{strokeDashoffset:0}}, "+=0")
	.to($('.eleventh-slide .brand-logo svg'), 1, {css:{stroke:'#555', fillOpacity: '1'}}, "+=0")
	.to($('.eleventh-slide .brand-logo svg'), 0.5, {autoAlpha:0}, "+=0")
	.to($('.eleventh-slide .brand-logo .logo-img'), 0.5, {autoAlpha:1}, "-=0.5")

	.staggerFromTo($('.eleventh-slide .api-container ul li.step1'), 0.7, {autoAlpha:0}, {autoAlpha:1, x:0, y:0, ease:Back.easeOut}, 0, "-=0.5")
	.staggerFromTo($('.eleventh-slide .api-container ul li.step2'), 0.7, {autoAlpha:0}, {autoAlpha:1, x:0, y:0, ease:Back.easeOut}, 0, "-=0.65")
	.staggerFromTo($('.eleventh-slide .api-container ul li.step3'), 0.7, {autoAlpha:0}, {autoAlpha:1, x:0, y:0, ease:Back.easeOut}, 0, "-=0.65")
	.staggerFromTo($('.eleventh-slide .api-container ul li.step4'), 0.7, {autoAlpha:0}, {autoAlpha:1, x:0, y:0, ease:Back.easeOut}, 0, "-=0.65")
	.staggerFromTo($('.eleventh-slide .api-container ul li.step5'), 0.7, {autoAlpha:0}, {autoAlpha:1, x:0, y:0, ease:Back.easeOut}, 0, "-=0.65")
}

function setJoiningSecHei() {
	var joiningSectionHeight = Math.floor(Math.tan((10*Math.PI)/180) * vw);
	css = 'section.joining-section, section.joining-section .before, section.joining-section .after {min-height:'+joiningSectionHeight+'px}'
	$('.dynamic-css').empty().append(css);
}


function backToText(elem) {
	elem.each(function() {
		var txt = $(this).text();
		$(this).empty().append(txt);
	})
}

function backToCss(elem) {
	elem.each(function() {
		$(this).removeAttr('style');
	})
}

function addClass(elem, cls) {
	elem.addClass(cls)
}