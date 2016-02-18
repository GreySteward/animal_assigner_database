$(document).ready(function() {

    $('#submit-people').on('click', postData);
    $('#submit-animal').on('click', postAnimalData);
    $('#magic').on('click', addAnimalId);
    getData();
    getAnimalData();

});


function postData() {
    event.preventDefault();

    var values = {};
    $.each($('#people-form').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    //console.log(values);

    $('#people-form').find('input[type=text]').val('');


    $.ajax({
        type: 'POST',
        url: '/people',
        data: values,
        success: function(data) {
            if(data) {
                // everything went ok
                console.log('from server:', data);
                getData();
            } else {
                console.log('error');
            }
        }
    });

}

function postAnimalData() {
    event.preventDefault();

    var values = {};
    $.each($('#animal-form').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    //console.log(values);

    $('#animal-form').find('input[type=text]').val('');


    $.ajax({
        type: 'POST',
        url: '/animal',
        data: values,
        success: function(data) {
            if(data) {
                // everything went ok
                console.log('from server:', data);
                getAnimalData();
            } else {
                console.log('error');
            }
        }
    });
}

function addAnimalId() {
    event.preventDefault();

    var values = {};
    $.each($('#animal_id').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });
    console.log('hi');
    console.log(values);

    $('#animal-form').find('input[type=text]').val('');

    $.ajax({
        type: 'POST',
        url: '/addAnimalId',
        data: values,
        success: function(data) {
            console.log(data);
        }
    });
}

function getData() {
    $('.person-data').remove();
    $.ajax({
        type: 'GET',
        url: '/people',
        success: function(data) {
   //         console.log(data);
            appendPeople(data);
        }
    });
}

function getAnimalData() {
    $('.animal-data').remove();
    $.ajax({
        type: 'GET',
        url: '/animal',
        success: function(data) {
         //   console.log(data);
            appendAnimal(data);
        }
    });
}


function appendPeople(peopleData) {
    for (var person in peopleData) {
        var per = peopleData[person];
        $('#person-data').append('<div class="person-match"></div>');
        var $el = $('#person-data').children().last();

        $el.append('<div class="person-data">' + per.first_name + " " + per.last_name + '</div>');
        $el.append('<input type="text" id="animal_id" name="animal_id" />');
        $el.append('<button id="magic">Magic</button>');
    }
}

function appendAnimal(animalData) {
    for (var animal in animalData) {
        var ani = animalData[animal];
        $('#animal-data').append('<p class="animal-data">' + ani.animal_id + " " + ani.animal_name + " " + ani.animal_color + '</p>')
}
}


