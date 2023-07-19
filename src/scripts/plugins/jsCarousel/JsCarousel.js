(function ($) {
  var window = this,
      document = window.document,
      documentElement = document.documentElement,
      $ = window.jQuery,
      $document = $(document);

  /* JsCarousel */
  $.fn.jsCarousel = function (options) {
      var config = $.extend({
          viewport: '.cover',
          itemList: '> ul',
          item: '> li',

          prevButton: '.prev',
          nextButton: '.next',
          // nextButton: '.btn-next',
          stopButton: '.stop',
          playButton: '.play',

          disabled: 'disabled',
          indicator: '.indicator',
          indicatorItems: 'li',
          indicatorCurrent: 'selected',
          mode: 'h',
          itemsInGroup: 1,
          selectedIndex: 0,
          circular: false,
          speed: 1000,
          roll: false,
          interval: 3000,
          imageGallery: false,
          random: false,
          page: false,
          pagetext: '.control-area',
          count: false,
          counttxt: 'count',
          restartDelay: 0,
          fullCenter: false,
          movestop: false,
          callBack: null
      }, options);

      return this.each(function () {
          if (config.roll) {
              config.circular = true;
          }

          var self = this,
              $self = $(self),
              $viewport = $self.find(config.viewport),
              viewportWidth = $viewport.width(),
              $itemList = $viewport.find(config.itemList),
              $items = $itemList.find(config.item),
              $page = $self.find(config.pagetext),
              $prevButton = $self.find(config.prevButton),
              $nextButton = $self.find(config.nextButton),
              $stopButton = $self.find(config.stopButton),
              $playButton = $self.find(config.playButton),
              $indicator = $self.find(config.indicator),
              $indicatorItems = $indicator.find(config.indicatorItems),
              groups = null,
              selectedIndex = null,
              lastIndex = null,
              direction = null,
              property = null,
              $selectedGroup = null,
              randamIndex = null,
              timer = null,
              countIndex = null;

          if ($.data(this, 'init.jsCarousel')) {
              destroy();
          }

          init();

          function init() {
              if (!$items.length || ($items.length <= config.itemsInGroup)) {
                  $prevButton.addClass(config.disabled);
                  $nextButton.addClass(config.disabled);
                  $indicatorItems.addClass(config.indicatorCurrent);

                  return null;
              }

              if (config.random) {
                  var selectedIndex = Math.floor((Math.random() * $items.length));

                  $.data(self, 'random.jsCarousel', true);
              }

              groups = makeGroups();

              selectedIndex = config.random ? selectedIndex : config.selectedIndex;
              countIndex = selectedIndex;
              lastIndex = groups && groups.length - 1;
              direction = (config.mode === 'v') ? 'top' : 'left';
              property = 'margin-' + direction;

              if (config.page) {
                  var pagerEl = $("<ul class='indicator'></ul>"),
                      pagerHtml = "",
                      length = config.itemsInGroup > 1 ? groups.length : $items.length;

                  for (var i = 0; i < length; i++) {
                      pagerHtml += "<li>" + (i + 1) + "�? 배너</li>";
                  }

                  $prevButton.after(pagerEl);
                  pagerEl.append(pagerHtml);
              }

              $indicator = $self.find(config.indicator),
              $indicatorItems = $indicator.find(config.indicatorItems);

              // COUNT 초기 ?�성
              if (config.count) {
                  $page.prepend("<span class='" + config.counttxt + "'>" + (countIndex + 1) + "/" + (lastIndex + 1) + "</span>");
              }

              $self
                  .bind('prev.jsCarousel', prev)
                  .bind('next.jsCarousel', next)
                  .bind('roll.jsCarousel', roll)
                  .bind('stop.jsCarousel', stop);

              $prevButton.bind('click.jsCarousel', function (e) {
                  e.preventDefault();

                  $self.trigger('prev.jsCarousel');
              });

              $nextButton.bind('click.jsCarousel', function (e) {
                  e.preventDefault();

                  $self.trigger('next.jsCarousel');
              });

              $playButton.addClass("on").attr("title", "?�재 ?�행중입?�다");

              $stopButton.bind("click.jsCarousel", function () {
                  //$playButton
                  //    .addClass("on")
                  //    .attr("title", "?�재 ?�행중입?�다");
                  //$(this)
                  //    .removeClass("on")
                  //    .removeAttr("title");
                  //$self.trigger('roll.jsCarousel');

                  // ����ư ���
                  if ($j(this).hasClass('on')) {
                      $j(this).removeClass('btn-play on play').addClass('btn-stop stop');
                  $self.trigger('roll.jsCarousel');
                  } else {
                      $j(this).removeClass('btn-stop stop').addClass('btn-play on play');
                      $self.trigger('stop.jsCarousel');
                  }
              });

              $playButton.bind("click.jsCarousel", function () {
                  //$stopButton
                  //    .addClass("on")
                  //    .attr("title", "?�재 ?��??�니??");
                  //$(this)
                  //    .removeClass("on")
                  //    .removeAttr("title");

                  //$self.trigger('stop.jsCarousel');
              });

              selectGroup(selectedIndex);

              if (config.roll) {
                  if (config.movestop) {
                      $indicator
                          .bind('mouseenter.jsCarousel', function () {
                              $self.trigger('stop.jsCarousel');
                          })
                          .bind('mouseleave.jsCarousel', function () {
                              $self.trigger('roll.jsCarousel');
                          });
                      $self.trigger('roll.jsCarousel');
                  } else {
                      $viewport
                          .bind('mouseenter.jsCarousel', function () {
                              $stopButton
                                  .attr("title", "?�재 ?��?중입?�다")
                                  .addClass("on");
                              $playButton
                                  .removeClass("on")
                                  .removeAttr("title");

                              $self.trigger('stop.jsCarousel');
                          })
                          .bind('mouseleave.jsCarousel', function () {
                              $playButton
                                  .attr("title", "?�재 ?�행중입?�다")
                                  .addClass("on");
                              $stopButton
                                  .removeClass("on")
                                  .removeAttr("title");

                              $self.trigger('roll.jsCarousel');
                          })
                          .trigger('roll.jsCarousel');
                  }
              }

              if ($indicator.length) {
                  $indicatorItems.each(function (i) {
                      $.data(this, 'index.jsCarousel', i);
                  });

                  $indicatorItems.bind('click.jsCarousel', function (e) {
                      e.preventDefault();
                      var index = $.data(this, 'index.jsCarousel');
                      selectGroup(index);
                  });
              }

              $.data(self, 'init.jsCarousel', true);
          }

          function destroy() {
              $indicatorItems
                  .removeData('index.jsCarousel')
                  .unbind('.jsCarousel');
              $prevButton.unbind('.jsCarousel');
              $nextButton.unbind('.jsCarousel');
              $items.removeData('groupIndex.jsCarousel');
              $self
                  .trigger('stop.jsCarousel')
                  .unbind('.jsCarousel')
                  .removeData('isMoving.jsCarousel')
                  .removeData('selectedGroup.jsCarousel')
                  .removeData('selectedIndex.jsCarousel')
                  .removeData('init.jsCarousel')
                  .removeData('random.jsCarousel');
          }

          function selectGroup(index, where) {
              if (index < 0 || $.data(self, 'isMoving.jsCarousel')) {
                  return null;
              }

              var distance = null,
                  moveTo = {};

              if (config.circular) {
                  var chunk = mergeGroups(index);

                  distance = getDistance(chunk);
                  moveTo[property] = -distance;

                  $.data(self, 'isMoving.jsCarousel', true);

                  if (index < selectedIndex) {
                      $itemList
                          .prepend(chunk)
                          .css(moveTo);
                      moveTo[property] = 0;

                      $itemList.animate(moveTo, config.speed, function () {
                          $.data(self, 'isMoving.jsCarousel', false);

                          afterSelect();
                      });
                  } else {
                      // ?�동 롤링?? ?�덤?? 처음?? true ?�중?? fasle 반환
                      // ?�동 롤링?? ?�덤?? true?�면 ?�번�? ?�행
                      if ($.data(self, 'random.jsCarousel')) {
                          $itemList.animate(moveTo, 10, function () {
                              $.data(self, 'isMoving.jsCarousel', false);

                              $itemList
                                  .append(chunk)
                                  .css(property, 0);

                              afterSelect();
                          });

                          $.data(self, 'random.jsCarousel', false);
                      } else {
                          if (config.fullCenter) {
                              var $firstGroup = $itemList.find(config.item).slice(0, config.itemsInGroup),
                                  $lastGroup = $itemList.find(config.item).slice(-config.itemsInGroup);

                              if (lastIndex >= 2) {
                                  $viewport.addClass("range3");
                              }

                              $itemList.animate(moveTo, config.speed, function () {
                                  $.data(self, 'isMoving.jsCarousel', false);

                                  afterSelect();
                              });
                          } else {
                              $itemList.animate(moveTo, config.speed, function () {
                                  $.data(self, 'isMoving.jsCarousel', false);

                                  $itemList
                                      .append(chunk)
                                      .css(property, 0);

                                  afterSelect();
                              });
                          }
                      }
                  }
              } else {
                  var selectedGroup = groups[index],
                      $firstItem = selectedGroup.eq(0);

                  distance = parseInt($itemList.css(property), 10) - $firstItem.position()[direction];
                  moveTo[property] = distance;

                  $.data(self, 'isMoving.jsCarousel', true);

                  if ($.data(self, 'random.jsCarousel')) {
                      $itemList.animate(moveTo, 10, function () {
                          $.data(self, 'isMoving.jsCarousel', false);

                          afterSelect();
                      });

                      $.data(self, 'random.jsCarousel', false);
                  } else {
                      $itemList.animate(moveTo, config.speed, function () {
                          $.data(self, 'isMoving.jsCarousel', false);

                          afterSelect();
                      });
                  }
              }

              function afterSelect() {
                  selectedIndex = index;
                  $selectedGroup = groups[selectedIndex];

                  if (!config.circular) {
                      $prevButton.removeClass(config.disabled);
                      $nextButton.removeClass(config.disabled);

                      if (selectedIndex === 0) {
                          $prevButton.addClass(config.disabled);
                      }
                      if (selectedIndex === lastIndex) {
                          $nextButton.addClass(config.disabled);
                      }
                  }

                  if ($indicator.length) {
                      $indicatorItems.removeClass(config.indicatorCurrent).removeAttr("title");
                      $indicatorItems.eq(selectedIndex).addClass(config.indicatorCurrent).attr("title", "?�택??");
                  }

                  $.data(self, 'selectedIndex.jsCarousel', selectedIndex);
                  $.data(self, 'selectedGroup.jsCarousel', $selectedGroup);

                  if (config.callBack && typeof config.callBack == "function") {
                      config.callBack(index, $selectedGroup);
                  }

                  if (config.imageGallery) {
                      if (where < 0) {
                          $selectedGroup.last().trigger('select.imageGallery');
                      } else if (where > 0) {
                          $selectedGroup.first().trigger('select.imageGallery');
                      }
                  }
              }
          }

          function prev() {
              if ($.data(self, 'isMoving.jsCarousel')) {
                  return null;
              }

              if (config.circular) {
                  var $firstGroup = $itemList.find(config.item).slice(0, config.itemsInGroup),
                      $lastGroup = $itemList.find(config.item).slice(-config.itemsInGroup),
                      distance = getDistance($lastGroup),
                      distance = 0,
                      moveTo = {};

                  distance = getDistance($lastGroup);

                  moveTo[property] = -distance;

                  $.data(self, 'isMoving.jsCarousel', true);

                  $itemList
                      .prepend($lastGroup)
                      .css(moveTo);

                  moveTo[property] = 0;

                  $itemList.animate(moveTo, config.speed, function () {
                      $.data(self, 'isMoving.jsCarousel', false);

                      afterAnimation();
                  });

                  if (countIndex <= 0) {
                      if (lastIndex >= 2) {
                          countIndex = 2;
                      } else {
                          countIndex = 1;
                      }
                  } else {
                      countIndex--;
                  }

                  if (config.count) {
                      $(".count").html((countIndex + 1) + "/" + (lastIndex + 1));
                  }
              } else {
                  var prevIndex = selectedIndex - 1;

                  if (prevIndex < 0) {
                      return null;
                  }

                  selectGroup(prevIndex, -1);

                  // 배너 �? 개수 �? ?�릭 ?? ?�재 INDEX
                  if (config.count) {
                      $(".count").html((prevIndex + 1) + "/" + (lastIndex + 1));
                  }
              }
          }

          function next() {
              if ($.data(self, 'isMoving.jsCarousel')) {
                  return null;
              }

              if (config.circular) {
                  var $firstGroup = $itemList.find(config.item).slice(0, config.itemsInGroup),
                      $lastGroup = $itemList.find(config.item).slice(-config.itemsInGroup),
                      distance = getDistance($selectedGroup),
                      moveTo = {},
                      nextIndex = selectedIndex + 1;

                  moveTo[property] = -distance;

                  $.data(self, 'isMoving.jsCarousel', true);

                  $itemList.animate(moveTo, config.speed, function () {
                      $.data(self, 'isMoving.jsCarousel', false);

                      $itemList
                          .append($selectedGroup)
                          .css(property, 0);

                      afterAnimation();
                  });

                  if (countIndex >= lastIndex) {
                      countIndex = 0;
                  } else {
                      countIndex++;
                  }

                  if (config.count) {
                      $(".count").html((countIndex + 1) + "/" + (lastIndex + 1));
                  }
              } else {
                  var nextIndex = selectedIndex + 1;

                  if (nextIndex > lastIndex) {
                      return null;
                  }
                  selectGroup(nextIndex, 1);

                  // 배너 �? 개수 �? ?�릭 ?? ?�재 INDEX
                  if (config.count) {
                      $(".count").html((nextIndex + 1) + "/" + (lastIndex + 1));
                  }
              }
          }

          function afterAnimation() {
              selectedIndex = $itemList.find(config.item).eq(0).data('groupIndex.jsCarousel');
              $selectedGroup = groups[selectedIndex];

              $.data(self, 'selectedIndex.jsCarousel', selectedIndex);

              if ($indicator.length) {
                  $indicatorItems
                      .removeClass(config.indicatorCurrent)
                      .removeAttr("title")
                      .eq(selectedIndex)
                      .addClass(config.indicatorCurrent)
                      .attr("title", "?�택??");
              }
          }

          function roll() {
              setTimeout(next, config.restartDelay);

              timer = window.setInterval(next, config.interval);
          }

          function stop() {
              window.clearInterval(timer);
              timer = null;
          }

          function makeGroups() {
              var len = $items.length,
                  itemsInGroup = config.itemsInGroup,
                  start = 0,
                  end = start + itemsInGroup,
                  groups = [],
                  group = null,
                  i = 0;

              if (!len) {
                  return null;
              }

              while (start < len) {
                  group = $items.slice(start, end);
                  group.data('groupIndex.jsCarousel', i);
                  groups[i++] = group;
                  start = end;
                  end = start + itemsInGroup;
              }

              return groups;
          }

          function mergeGroups(index) {
              var chunk = $(),
                  cond = (index < selectedIndex),
                  i = cond ? index : selectedIndex,
                  end = cond ? selectedIndex : index;

              while (i < end) {
                  chunk = $.merge(chunk, groups[i++]);
              }

              return chunk;
          }

          function getDistance(group) {
              if (!(group && group.length)) {
                  return null;
              }

              var distance = 0,
                  cond = config.mode === 'v';

              group.each(function () {
                  distance += cond ? $(this).outerHeight(true) : $(this).outerWidth(true);
              });

              return distance;
          }

          function callBack() {
          }
      });
  }

  /* Dom Ready */
})(jQuery);
