$(function(){


  //Data Controller
  const dataController = (function() {

    const getImages = function(tag, callback) {
      url = 'http://www.flickr.com/services/feeds/photos_public.gne?tags='+tag+'&format=json&jsoncallback=?';

      $.getJSON(url)
      .done(function(data){
        callback(data.items);
      })
      .fail(function(err){
        console.log(err);
        callback(false);
      });
    };


    return {
      searchTag: function(tag, callback) {
        getImages(tag, callback);
      }
    };
    
  })();


  //UI Controller
  const uiController = (function() {

    const domStrings = {
      searchForm: '#search-form',
      searchBtn: '#search-btn',
      searchInput: '#search-input',
      imagesContainer: '#images-container'
    };

    return {

      updateImageSearchDisplay(images) {
        let imgDisplay = $(domStrings.imagesContainer);
        if (!images) { // error
          imgDisplay.html('<p>Oops! Try again later...</p>');
          return;
        }

        let html = '';
        images.forEach(image => {
          const {title, media, link} = image;

          // make square thumbnail
          const src = media.m.split('m.jpg').join('s.jpg');

          //create img
          html+=`<div class="thumbnail"><a href="${link}" target="_blank"><img src="${src}" alt=${title} /></a></div>`;
        });
        imgDisplay.html(html);
      },

      clearForm: function() {
        $(domStrings.searchInput).val('');
      },

      getDomStrings: function() {
        return domStrings;
      }
    };

  })();


  //Global App Controller
  const controller = (function(dataCtrl, uiCtrl) {

    const domStrings = uiController.getDomStrings();

    const handleSearch = function() {
      const tag = $(domStrings.searchInput).val();
      uiCtrl.clearForm();
      dataCtrl.searchTag(tag, uiCtrl.updateImageSearchDisplay);
    }

    const setEventListeners = function() {

      $(domStrings.searchForm).on('submit', function(e) {
        e.preventDefault();
        handleSearch();
      });
      $(domStrings.searchBtn).click(handleSearch);

    }

    return {
      init: function() {
        setEventListeners();
      }
    }
  })(dataController, uiController);


  controller.init();

});