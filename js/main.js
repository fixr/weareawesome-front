$(document).ready(function() {

  var base_uri = 'http://weareawesome.herokuapp.com/api/v1'

  //
  // HOME PAGE
  //
  if($('#content.list').length > 0) {
    loadItemsPage(1)
  }

  function loadItemsPage(page) {

    $('body').addClass('loading')

    showItems(page)
    // Paginación
    .done(function(data, status, xhr){

      // previous page
      if(data.previous_page !== null && data.previous_page !== '') {
        $('#prev-page')
        .attr('data-page', data.previous_page)
        .show()
        .off('click')
        .on('click', function(){
          loadItemsPage(data.previous_page)
          return false
        })
      } else {
        $('#prev-page').hide()
      }

      // next page
      if(data.next_page !== null && data.next_page !== '') {
        $('#next-page')
        .attr('data-page', data.next_page)
        .show()
        .off('click')
        .on('click', function(){
          loadItemsPage(data.next_page)
          return false
        })
      } else {
        $('#next-page').hide()
      }
    })
    .always(function(){
      $('body').removeClass('loading')
    })
  }


  function showItems(page) {
    var items;

    items = $.ajax({
      type: 'GET',
      url: base_uri + '/items?page=' + page,
      dataType: 'json'
    })
    .done(function(data, status, xhr){
      var html = new EJS({ url: 'templates/items.ejs' }).render(data)
      $('#content.list').html(html)
    })
    .fail(function(xhr, errorType, error){
      console.log('error: ', errorType)
    })

    return items
  }



  //
  // SHARE PAGE
  //
  if($('#content.share').length > 0) {
    loadSharePage()
  }

  function loadSharePage() {
    $('#item_kind').on('change', function() {
      var $el = $(this);

      if($el.val() === 'url') {
        $('#item_url').parents('.item').show();
        $('#item_description').parents('.item').hide();
      } else if($el.val() === 'description') {
        $('#item_url').parents('.item').hide();
        $('#item_description').parents('.item').show();
      } else {
        $('#item_url').parents('.item').hide();
        $('#item_description').parents('.item').hide();
      }
    })

    $('[data-role="submit"]').on('click', function(e) {
      
      $('body').addClass('loading')

      $.ajax({
        type: 'POST',
        url: base_uri + '/items',
        data: $('form').serialize(),
        dataType: 'json'
      })
      .done(function(data, status, xhr){
        $('body').removeClass('loading')
        window.location = "item.html?item=" + data.id;
      })
      .fail(function(xhr, errorType, error){
        var response = JSON.parse(xhr.response);

        if(typeof response.errors !== 'undefined' && response.errors !== '') {
          $('body').removeClass('loading')

          var msg = "<p>The following fields can't be left blank:</p><ul>"
          $.each(response.errors, function(key, value) {
            msg += '<li>' + key + '</li>'
          })
          msg += '</ul>'

          showModal('Oops...', msg)
        }
      })

      return false
    })
  }



  //
  // ITEM PAGE
  //
  if($('#content.item').length > 0) {
    $('body').addClass('loading')

    showItem(QueryString.item)
    .always(function(){
      $('body').removeClass('loading')
    })
  }

  function showItem(id) {
    var itemData;

    itemData = $.ajax({
      type: 'GET',
      url: base_uri + '/items/' + id,
      dataType: 'json'
    })
    .done(function(data, status, xhr){
      var html = new EJS({ url: 'templates/item.ejs' }).render(data)
      $('#content.item').html(html)
    })
    .fail(function(xhr, errorType, error){
      console.log('error: ', errorType)
    })

    return itemData
  }

  // Bindings de los enlaces para que Phonegap los abra en un browser
  $(document).on( 'click', '[data-open-in-browser]', function() {
    var $el = $(this);
    var ref = window.open($el.prop('href'), '_blank', 'location=yes');
    
    return false
  })

  // Enlace de "about"
  $(document).on( 'click', '[data-role="about"]', function() {
    showModal('Celebrate Humankind!','<p><strong>We Are Awesome!</strong> is a collection of stories and media of people that bring something positive to humankind.</p><p>The idea is that together, we give a glimpse of the positive side of humankind; the good, the caring, the helpful people out there that deserve recognition.</p><p>So, if you are or know someone like that, those anonymous – and not so anonymous – heroes that make the world a better place... <strong>share your story!</strong></p>')
    
    return false
  })



  //
  // NOTIFICATIONS MODAL
  //
  function showModal(title, message) {
    $('#notifications .title').html(title)
    $('#notifications .message').html(message)
    $('#notifications').show()
  }

  $('[data-role="close-modal"]').on('click', closeModal)
  
  function closeModal() {
    $('#notifications').hide()
    $('#notifications .title').html('')
    $('#notifications .message').html('')
  }

})


//
// UTILS
//

var QueryString = function () {
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
      // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
    return query_string;
} ();



//
// ---- PhoneGap ----
//

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

}
