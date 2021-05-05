$('#roadBtn').click(function() {
    $(this).toggleClass('roadBtn-on');
    $('#roadMap').toggleClass('hasNone');
})

$('#roadMap_switch button').click(function() {
    $('#roadMap_switch button').removeClass();
    $(this).addClass('switch_on');

    $('#roadMap_tab button:eq(0)').text($(this).text());
})

$('#roadMap_close').click(function() {
    $('#roadBtn').removeClass('roadBtn-on');
    $('#roadMap').addClass('hasNone');
})

$('#roadMap_tab button').click(function() {
    $('#roadMap_tab button').removeClass();
    $(this).addClass('tab_on');
})

var testData1 = ['1', '1', '1', '1', '1', '1', '1', 
                 '2', '3', '4', '5', '6', '1', '2', '3', '4', '5', '6', '1', '2', '3', '4',
                 '5', '5', '5', '5', 
                 '6']
var testData2 = ['大', '大', '大', '大', '大', '大',
                 '大', '小', '大', '小', '大', '小', '大', '小', '大', '小', '大', '小', '大', '小', '大', '小',
                 '大', '大', '大', '大', 
                 '小']
var testData3 = ['雙', '雙', '雙', '雙', '雙', '雙', '雙',
                 '單', '雙', '單', '雙', '單', '雙', '單', '雙', '單', '雙', '單', '雙', '單', '雙', '單', 
                 '雙', '雙', '雙', '雙', 
                 '單']

var testData4 = [40,10,0,30,10,20]

var testCount = 0;
for(var i=0;i<6;i++){
    testCount += testData4[i];
}
for(var i=0;i<6;i++){
    var ratio = (testData4[i] / testCount * 100).toFixed(1)
    $(`#buyMap li:eq(${i}) .progress`).css('width',`${ratio}%`);
    $(`#buyMap li:eq(${i}) .ratio`).text(ratio)
}

loadData(testData1);
$('#roadMap_tab button').click(function() {
   var x = $('#roadMap_tab button').index(this)
   $('#roadItem div').remove()
   switch(x){
       case 0 :loadData(testData1); chMap(1); break;
       case 1 :loadData(testData2); chMap(1); break;
       case 2 :loadData(testData3); chMap(1); break;
       case 3 :chMap(2);break;
   }
})


function chMap(c){
    if(c == 1){
        $('#roadMap_items').removeClass('hasNone');
        $('#buyMap').addClass('hasNone');
    }else{
        $('#roadMap_items').addClass('hasNone');
        $('#buyMap').removeClass('hasNone');
    }
}

function loadData(testData) {
    var now = testData[0];
    var count = 0;
    $('#roadItem').append('<div></div>')
    var colo;
    for (var i = 0; i < testData.length; i++) {
        switch(testData[i]){
            case '大':case '雙':case '1':
            color =  'roadColor_r'; break;
            case '小':case '單':case '5':
            color =  'roadColor_b'; break;
            case '2':
            color =  'roadColor_y'; break;
            case '3':
            color =  'roadColor_g'; break;
            case '4':
            color =  'roadColor_c'; break;
            case '6':
            color =  'roadColor_p'; break;
        }

        if (count == 17) {
            $('#roadItem div:eq(0)').remove();
            count--;
        }
        if (count < 18) {
            if (testData[i] == now) {
                $(`#roadItem div:eq(${count})`).append(`<span class="${color}">${testData[i]}</span>`);
            } else {
                $('#roadItem').append('<div></div>');
                $(`#roadItem div:eq(${++count})`).append(`<span class="${color}">${testData[i]}</span>`);
            }
        }
        now = testData[i];
    }
}