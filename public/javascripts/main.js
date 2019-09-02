localStorage.id = Math.floor(Math.random() * 10000000);

var currentKverstion = -1;
var currentType = "welcome";

var url_string = window.location.href;
var url = new URL(url_string);
var group = url.searchParams.get("cs");

$("#letsgobutton").click(function () {
  getKuestion();
});

function getKuestion() {
  $.post("/kuestion", { lastKvestion: currentKverstion }, function(response) {
    console.log(response);
    currentKverstion += 1;
    if(response.ended) {
      doFading("nicejob");
    }
    if(response.type == "image") {
      setTimeout(function() {
        for (var i = 0; i < response.images.length; i++) {
          if(response.images[i] != "") {
            $("#kep" + i).show();
            $("#kep" + i).attr("src", "/images/" + response.images[i]);
          } else {
            $("#kep" + i).hide();
          }
        }
      }, 500);
      doFading("images");
    }
    else if(response.type == "text") {
      $("#textkuestiontext").text(response.text);
      doFading("textkuestion");
    } else if(response.type == "choice") {
      $("#multichoicetext").text(response.text);
      $("#choice1").text(response.choice1);
      $("#choice2").text(response.choice2);
      doFading("multichoice");
    }
  });
}

function postAnswer(answer) {
  $.post("/answer", { sender: localStorage.id, group: group, answer: answer, kuestion: currentKverstion }, function (response) {
    getKuestion();
  })
}

function doFading(newType) {
  if(newType == currentType) {
    if(newType == "images") {
      $("#imagecontainer").fadeOut();
      setTimeout(function() { $("#imagecontainer").fadeIn(); }, 500);
    }
    return;
  } else {
    $("#" + currentType).fadeOut();
    setTimeout(function() { $("#" + newType).fadeIn(); }, 500);
    currentType = newType;
  }
}

function postChoice(choice) {
  postAnswer($("#choice" + choice).text());
}

$("#kep0").click(function() {
  postAnswer(1);
});
$("#kep1").click(function() {
  postAnswer(2);
});
$("#kep2").click(function() {
  postAnswer(3);
});
$("#kep3").click(function() {
  postAnswer(4);
});
$("#textform").submit(function submitTextForm(event) {
  event.preventDefault();
  $("#textkuestion").fadeOut();
  postAnswer($("#textAnswer").val());
});
