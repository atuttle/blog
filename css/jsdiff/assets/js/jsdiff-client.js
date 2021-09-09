$(function () {
  $("#submit").on("click", function () {
    var pre = $("#isCode").prop("checked");
    if (pre) {
      $("#result").html(
        "<pre>" + diffString($("#left").val(), $("#right").val()) + "</pre>"
      );
    } else {
      $("#result").html(diffString($("#left").val(), $("#right").val()));
    }
  });
});
