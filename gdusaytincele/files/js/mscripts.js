var lang = window.location.pathname.split('/')[1];

$( document ).ajaxSuccess(function( event, xhr, settings ) {

    var obj = xhr.responseJSON;

    if( typeof(obj) != "undefined" && obj !== null )
    {
        if( typeof(obj.returnUrl) != "undefined" && obj.returnUrl !== null )
            window.location.href = obj.returnUrl;
    }

});

/*$(window).load(function(){

    if( window.location.hash )
    {
        var hash = window.location.hash.replace('#','');
        var data = hash.split('_');
        if( $.isNumeric(data[0]) )
        {
            notificationPopup(data[0], data[1]);
        }
    }
});*/

$(window).bind('hashchange load', function() {
    var hash = window.location.hash.replace('#','');
    var data = hash.split('_');
    if( $.isNumeric(data[0]) )
    {
        notificationPopup(data[0], data[1]);
    }
});


$(document).on('hide.bs.modal', $('button[data-mopen]').data('mopen'), function () {
    $('#applyId').val('');
    $(".load-apply2").hide();
    $(".load-apply").hide();
});

$(document).on('hide.bs.modal', '#modal6', function () {
    if( window.location.hash )
        window.location.hash = '';
    var ID = $(this).data('clear');
    var unread = $(this).data('unread');
    var allCount = $('.not_all').html();

    if( $.isNumeric(ID) )
    {
        if( $('[data-id="not_'+ID+'"]').length > 0 )
            $('[data-id="not_'+ID+'"]').remove();

        if( !$('[data-id="'+ID+'"]').hasClass('grey') )
            $('[data-id="'+ID+'"]').addClass('grey');

        if( unread != 0 )
        {
            $( '[data-id="'+ID+'"]' ).closest('.news-content').parent().attr('style', 'border-left: 5px solid #265325 !important;');

            if( ( allCount - unread ) > 0 )
                $('.not_all').html( allCount - unread );
            else
                $('.not_all').remove();
        }
    }

});

jQuery( document ).ready(function() {
    jQuery.extend({
        MAlert: function (content)
        {
            var blockPage = '<div class="main_lightbox">'+
                            '<div class="lightbox" id="wait_lightbox">'+
                                '<div class="vertical-center-row">'+
                                    '<div style="margin-top: -10%;" align="center">'+
                                        '<div class="loginbox-textbox">'+
                                            '<div class="mailTitle" style="font-weight:bold">'+content+'</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
            $('body').append(blockPage);
        }
    });

    jQuery.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    }


   /** NEW codes */
    var popupModalId = '#popupModalInstructions';

    $(document).on('show.bs.modal', popupModalId, function () {
        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
        $("html, body").css('overflow', 'hidden');
    });
    $(document).on('hide.bs.modal', popupModalId, function () {
        $("html, body").css('overflow', '');
    });

    $(document).on('hide.bs.modal', '#modal4', function () {
        if( $('#modal3').hasScrollBar() )
            $('#modal3').css('overflow-y', 'scroll');
    });

    $('body').on( 'click', '.InstructionsModal', function( event ) {
        var url = $(this).data('url');
        var title = $(this).data('title')+' - '+$(this).html();

        title = title.substr(0, title.length - 13 )

        $(popupModalId+ ' .modal-header h4').html(title);
        $(document).on('show.bs.modal', popupModalId, function () {
            $('#popupModalInstructionsFrame').attr("src", url );
        });
        $(popupModalId).modal({show:true});

        return false;
    });
 
    $('body').on( 'change', '#eduYear,#eduYear2,#nameEduYear,#eduYearInd,#eduYearFiles', function( event ) {

        var type = $(this).attr('id');
        var id = $( this ).val();
        var ajaxUrl = '/'+lang+'/getEduSemester';
        var selectObj = $("#eduSemester");
        
        if(type=='nameEduYear')
        {
            selectObj = $('#nameEduSemester');
        }
        else if(type=='eduYearInd')
        {
            selectObj = $('#eduSemesterIndependent');
        }
        
        else if(type=='eduYearFiles')
        {
            selectObj = $('#eduSemesterFiles');
        }
        
        $.ajax({
            type: 'POST',
            data:'type='+type+'&id='+id,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend:function()
            {
                selectObj.html('');
            },
            success: function(data)
            {
              selectObj.html(data);
            }
        });


        return false;
    });
    
    
    $('body').on( 'change', '#nameEduSemester', function( event ) {

        
        var id = $( this ).val();
        var ajaxUrl = '/'+lang+'/getEduSubjectsBySemester';
        var selectObj = $("#subject");
        
        $.ajax({
            type: 'POST',
            data:'id='+id,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend:function()
            {
                selectObj.html('');
            },
            success: function(data)
            {
              selectObj.html(data);
            }
        });


        return false;
    });
    


    $(".appealFilter:not(#eduYear2)").change(function(){
        var filters = $('.appealFilter').serialize();
        var url = $(this).parents('.filterArea').data('href');

        if( url != '' )
            window.location.href = url+'?'+filters;

    });
    $(".filesFilter:not(#subject)").change(function(){
        var filters = $('.filesFilter').serialize();
        var url = $(this).parents('.filterArea').data('href');
/*
        var takeValSubj = $('#subject').val();
        var subjId=$('option[data-subject='+takeValSubj+']').data('subject');

        var ajaxUrl = '/'+lang+'/files';
        $.ajax({
            type: 'POST',
            data:'subjId='+subjId,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend:function()
            {
                $('#teacherList').html('');
            },
            success: function(data)
            {
               $('#teacherList').html(data);
            }
        });*/


        var data_subj = $('#subject').find(':selected').attr('data-subject')
        var eduYearFiles= $('#eduYearFiles').val();
        var eduSemester= $('#eduSemesterFiles').val();

        if( url != '' )
            window.location.href = url+'?'+filters+'&subjId='+data_subj+'&eduYearFiles='+eduYearFiles+'&eduSemester='+eduSemester;

    });
    $("select[data-type=stEvaSelect]:not(#eduYear)").change(function(){
        var filters = $('select[data-type=stEvaSelect]').serialize();
        var url = $(this).parents('.filterArea').data('href');

        if( url != '' )
            window.location.href = url+'?'+filters;

    });


    $('body').on( 'click', '#studentEvaluation-grid > .table > tbody > tr > td', function( event ) {

        if( $(this).parent().children("td:nth-child(2)").is(':hidden') )
        {
            var ID = $(this).parent().children("td:nth-child(2)").html().trim();
            if( $.isNumeric(ID) )
            {
                var lessonType = $("#lessonType").val();
                var ajaxUrl = '/'+lang+'/studentEvaluationPopup';
                $.ajax({
                    type: 'POST',
                    data: 'id='+ID+'&lessonType='+lessonType,
                    url: ajaxUrl,
                    cache: false,
                    processData: false,
                    beforeSend: function()
                    {
                        $('#applyPopup').html('');
                    },
                    success: function(data)
                    {
                        $('#applyPopup').html(data);
                        $('#modal2').modal('show');
                    }
                });
            }
        }
    });



    $("body").on( "click", "a.openModalFile", function( event ) {
        var ajaxUrl = $(this).attr('href');
        var controlId = $(this).data('id');
        
        if(controlId == 1 )
        {
            $.ajax({
                type: 'POST',
                data: 'type=new',
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    $('#applyPopup').html('');
                },
                success: function(data)
                {
                    $('#applyPopup').html(data);
                    $('#modalFileForm').modal('show');
                }
            }); 
        }
        else
        {
            alert('Yeni melumatin daxil edilmesi deaktiv edilib.');
        }
        

        return false;
    });
    $("body").on( "click", "#infoIndependent", function( event ) {
        var ajaxUrl =  '/'+lang+'/infoIndependent';
        var subjGroupID= $("#lessonTypeIndependent").val();
        $.ajax({
                type: 'POST',
                data: 'subjGroupID='+ subjGroupID,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    $('#applyPopup').html('');
                },
                success: function(data)
                {
                    $('#applyPopup').html(data);
                    $('#modalInfo').modal('show');
                }
            });
       
    });

    $("body").on( "change", "#Evaluation_term,#Evaluation_teacher", function( event ){

        var id=$(this).val();
        var type = $(this).attr('id');

        var addCon = '&current=true';
        var ajaxUrl = '/'+lang+'/evadata';
        $.ajax({
            type: 'POST',
            data: 'type='+type+'&id='+id+addCon,

            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {

                if( type == 'Evaluation_term' )
                {
                    $('#Evaluation_teacher').find('[value!=""]').remove();
                    $('#Evaluation_teacher').attr('disabled','disabled');
                }
            },
            success: function(data)
            {
                if( data != 0 )
                {
                    if( type == 'Evaluation_term' )
                    {
                        $('#Evaluation_teacher').html(data);
                        $('#Evaluation_teacher').removeAttr('disabled');
                    }
                }
            }
        });
    });
    $("body").on( "change", "#Evaluation_teacher, #Evaluation_term", function( event ) {

        if( $(this).attr('id') == 'Evaluation_teacher' )
            $('#Evaluation_sid').find('option:selected').removeAttr("selected");

        if( $(this).val() != '' && $(this).attr('id') == 'Evaluation_teacher' )
        {
            $('.didSelect').removeAttr('disabled');

            var _id = $('#Evaluation_sid').find("option:contains('"+$(this).val()+"')").val();
            $('#Evaluation_sid').val(_id);
        }
        else
        {
            $('.didSelect').val('');
            $('.didSelect').attr('disabled','disabled');
        }

        if( $(this).attr('id') == 'Evaluation_term' )
        {
            $('#Evaluation_teacher').val('');
            $('.didSelect').val('');
            $('.didSelect').attr('disabled','disabled');
        }
    });

    $("body").on( "change", "#Evaluation_eyear", function( event ) {
        var ajaxUrl = '/'+lang+'/evadata';
        var type = $(this).attr('id');
        var id = $(this).val();
        var addCon = '&current=true';
        if( typeof( $(this).attr('data-current') ) != 'undefined' )
        {
            if( $(this).attr('data-current') == 'false' )
                addCon = '&current=false';
        }

        if( id == '' )
        {
            if( $(this).attr('data-refresh') == 'true' )
            {
                window.location.href = $(this).parents('.filter-group').data('href');
                return;
            }
        }

        $.ajax({
            type: 'POST',
            data: 'type='+type+'&id='+id+addCon,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                if( type == 'Evaluation_eyear' )
                {
                    //$('#Evaluation_teacher').find('[value!=""]').remove();
                    //$('#Evaluation_teacher').attr('disabled','disabled');
                    $('#Evaluation_teacher').val('');

                    $('.didSelect').val('');
                    $('.didSelect').attr('disabled','disabled');
                }

                if( type == 'Evaluation_eyear' )
                {
                    $('#Evaluation_term').find('[value!=""]').remove();
                    $('#Evaluation_term').attr('disabled','disabled');
                }
            },
            success: function(data)
            {
                if( data != 0 )
                {
                    if( type == 'Evaluation_eyear' )
                    {
                        $('#Evaluation_term').html(data);
                        $('#Evaluation_term').removeAttr('disabled');
                    }
                }
            }
        });
    });

    /** END */

    /** NEW VERSION **/

    $("body").on( "click", "div.ePopupDiv", function( event ) {
        var ajaxUrl = '/'+lang+'/eplan';

        $.ajax({
            type: 'POST',
            data: 'type=new',
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                $('#applyPopup').html('');
            },
            success: function(data)
            {
                $('#applyPopup').html(data);
                $('#modalPlanCreate').modal('show');
            }
        });
    });
    
    $("body").on( "click", "#appealPopup", function( event ) {
        $("#applyPopup").addClass("forAppealModal");
        var ajaxUrl = '/'+lang+'/studentAppealPopup';

        $.ajax({
            type: 'POST',
            data: 'type=new',
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                $('#applyPopup').html('');
            },
            success: function(data)
            {
                $('#applyPopup').html(data);
                $('#modalAppeal').modal('show');
            }
        });
    });
    
  
    

    /** NEW VERSION END */

    $("body").on( "change", "select#LangSelectId", function( event ) {

        var url = $(this).find('option:selected').data('url');

        document.location.href = url;

    });

    $('body').on( 'click', 'li.task[data-url]', function( event ) {
        var url = $(this).data('url');

        window.location.href = url;
    });

    $('body').on( 'click', 'a[data-npopup="open"], li[data-npopup="open"]', function( event ) {
        var id = $(this).data('id');
        var read = $(this).data('read');
        var ajaxUrl = '/'+lang+'/notview';

        $.ajax({
            type: 'POST',
            data: 'id='+id,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                $('#applyPopup').html('');
            },
            success: function(data)
            {
                $('#applyPopup').html(data);
                $('#modal6').modal('show');
            }
        });
    });
    
    $('body').on( 'click', 'a[data-apopup="open"], li[data-apopup="open"]', function( event ) {
        var id = $(this).data('id');
        var ajaxUrl = '/'+lang+'/annview';

        $.ajax({
            type: 'POST',
            data: 'id='+id,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                $('#applyPopup').html('');
            },
            success: function(data)
            {
                $('#applyPopup').html(data);
                $('#modal6').modal('show');
            }
        });
    });

    $('body').on( 'click', 'a#applyDenial', function( event ) {
        var conf = $(this).data('conf');
        window.dd =  $(this).data;

        if( confirm(conf) )
            window.location.href = $(this).attr('href');

        return false;
    });
    $('body').on( 'change', 'select#ManApplyEduFor_EDU_PROG', function( event ){
        var val = $(this).val();
        var obj = $('#price');

        if( val != '' )
        {
            var ajaxUrl = '/'+lang+'/elpi';
            $.ajax({
                type: 'POST',
                data: '_l='+val+'&_t=2',
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    obj.val('');
                    obj.attr('disabled','disabled');
                },
                success: function(data)
                {
                    obj.val(data);
                    obj.attr('disabled','disabled');
                }
            });
        }
        else
        {
            obj.val('');
            obj.attr('disabled','disabled');
        }

    });

    $('body').on( 'change', 'select#ManApply_DIC_SELECTED_PROFESSION_ID', function( event ){
        var val = $(this).val();
        var obj = $('#price');

        if( val != '' )
        {
            var ajaxUrl = '/'+lang+'/elpi';
            $.ajax({
                type: 'POST',
                data: '_l='+val+'&_t=0',
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    obj.val('');
                    obj.attr('disabled','disabled');
                },
                success: function(data)
                {
                    obj.val(data);
                    obj.attr('disabled','disabled');
                }
            });
        }
        else
        {
            obj.val('');
            obj.attr('disabled','disabled');
        }

    });

    $('body').on( 'change', 'select#ManApplyEduSec_DIC_SELECTED_PROFESSION_ID', function( event ){
        var val = $(this).val();
        var obj = $('#price');

        if( val != '' )
        {
            var ajaxUrl = '/'+lang+'/elpi';
            $.ajax({
                type: 'POST',
                data: '_l='+val+'&_t=1',
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    obj.val('');
                    obj.attr('disabled','disabled');
                },
                success: function(data)
                {
                    obj.val(data);
                    obj.attr('disabled','disabled');
                }
            });
        }
        else
        {
            obj.val('');
            obj.attr('disabled','disabled');
        }

    });

    $('body').on( 'change', 'select#ManApplyEduSec_DIC_SELECTED_EDUTYPE_ID', function( event ){
        var val = $(this).val();
        var obj = $('#ManApplyEduSec_DIC_SELECTED_PROFESSION_ID');

        if( val != '' )
        {
            var ajaxUrl = '/'+lang+'/dsei';
            $.ajax({
                type: 'POST',
                data: '_l='+val,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    obj.find('[value!=""]').remove();
                    obj.attr('disabled','disabled');
                },
                success: function(data)
                {
                    if( data != 0 )
                    {
                        obj.removeAttr('disabled');
                        obj.html(data);
                    }
                    else
                    {
                        obj.find('[value!=""]').remove();
                        obj.attr('disabled','disabled');
                    }
                }
            });
        }
        else
        {
            obj.find('[value!=""]').remove();
            obj.attr('disabled','disabled');
        }

    });

    $("body").on( "change", "select[data-change='true']", function( event ) {
        var objLang = $('#ManApplyEduFor_EDU_LANG');
        var objLevel = $('#ManApplyEduFor_EDU_LEVEL');

        var appendObj = ['#ManApplyEduFor_EDU_PROG', '#ManApplyEduFor_LES_PROF_ID'];

        var ajaxUrl = '/'+lang+'/eprog';

        if( objLang.val() != '' && objLevel.val() != '' )
        {
            $.ajax({
                type: 'POST',
                data: '_l='+objLang.val()+'&_v='+objLevel.val(),
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    $.each( appendObj, function( key, value ) {
                        $(value).find('[value!=""]').remove();
                        $(value).attr('disabled','disabled');
                    });
                },
                success: function(data)
                {
                    if( data != 0 )
                    {
                        $('#ManApplyEduFor_EDU_PROG').removeAttr('disabled');
                        $('#ManApplyEduFor_EDU_PROG').html(data);
                    }
                    else
                    {
                        $.each( appendObj, function( key, value ) {
                            $(value).find('[value!=""]').remove();
                            $(value).attr('disabled','disabled');
                        });
                    }
                }
            });
        }
        else
        {
            $.each( appendObj, function( key, value ) {
                $(value).find('[value!=""]').remove();
                $(value).attr('disabled','disabled');
            });
        }
    });

    $("body").on( "click", "a#newCode", function( event ) {

        $('#ManWebUsers_PASSWORD').val($.password(7));
    });

    $('body').on( 'click', 'a[data-mopen_not]', function( event ) {
        var id = $(this).data('mopen_not');
        var did = $(this).data('id');
        var type = $(this).data('type');

        notificationPopup(did,type);

        /*var ajaxUrl = '/'+lang+'/notification';

        $.ajax({
            type: 'POST',
            data: 'id='+did+'&open=',
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                $('#applyPopup').html('');
            },
            success: function(data)
            {
                $('#applyPopup').html(data);
                $(id).modal('show');
            }
        });*/
    });

    $('body').on( 'click', 'a[data-mopen]', function( event ) {
        var id = $(this).data('mopen');
        var did = $(this).data('id');
        var type = $(this).data('type');
        var ajaxUrl = '/'+lang+'/apply';

        if( type == 2 )
            var applyType = 0;
        else if( type == 3 )
            var applyType = 1;
        else
            var applyType = 2;

        $.ajax({
            type: 'POST',
            data: 'id='+did+'&a='+applyType+'&open=',
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                $('#applyPopup').html('');
            },
            success: function(data)
            {
                $('#applyPopup').html(data);
                $(id).modal('show');

                $('#ManApply_BIRTH_DATE, #ManApply_SUB_ELEM_DATE_VAL, #ManApply_DIPLOM_GIVEN_DATE, #ManApplyEduSec_BIRTH_DATE').datepicker({
                  format: "dd/mm/yyyy",
                  todayBtn: "linked",
                  todayHighlight: true,
                  language: lang,
                });
            }
        });
    });

    $('body').on( 'click', 'button[data-mopen]', function( event ) {

       var applyType = $('#applyId').val();
       var ajaxUrl = '/'+lang+'/apply';
       var id = $(this).data('mopen');

       if( $('#applyId').length == 0 )
            applyType = $(this).data('type');

        if( applyType >= '0' )
        {
            $.ajax({
                type: 'POST',
                data: 'a='+applyType+'&open=',
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    $('#applyPopup').html('');
                },
                success: function(data)
                {
                    $('#applyPopup').html(data);
                    $(id).modal('show');

                    $('#ManApply_BIRTH_DATE, #ManApply_SUB_ELEM_DATE_VAL, #ManApply_DIPLOM_GIVEN_DATE, #ManApplyEduFor_BIRTH_DATE, #ManApplyEduSec_BIRTH_DATE').datepicker({
                      format: "dd/mm/yyyy",
                      todayBtn: "linked",
                      todayHighlight: true,
                      language: lang,
                    });
                }
            });
        }

    });

    $('body').on( 'click', 'div.rules_popup', function( event ) {
        var _this = $(this).children('label');
        var ID = _this.data('id');
        var EID = _this.data('eid');
        var m = _this.attr('for');
        if( $.isNumeric(ID) && $.isNumeric(EID) )
        {
            var ajaxUrl = '/'+lang+'/subject';
            $.ajax({
                type: 'POST',
                data: 'id='+ID+'&eid='+EID+'&open=',
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    if( $('#'+m).length > 0 )
                        $('#'+m).remove();

                    $.MAlert($('#modal3').data('message'));
                },
                success: function(data)
                {

                    $("html, body").animate({ scrollTop: 0 }, {duration: "slow", complete: function() {
                        /*$('html, body').css({
                            'overflow': 'hidden',
                            'height': '100%'
                        });*/
                    } });

                    setTimeout( function() {
                        $('.main_lightbox').hide();
                        $('#applyPopup').append(data);
                        $('#'+m).modal('show');
                    },600);

                }
            });
        }
    });

    $('body').on( 'click', '#eresults-grid > .table > tbody > tr > td', function( event ) {
        
        if( $(this).parent().children("td:nth-child(2)").is(':hidden') )
        {
            var ID = $(this).parent().children("td:nth-child(2)").html().trim();
            var MAIN = $(this).parent().children("td:nth-child(3)").html().trim();
            var title_eresult_subject = $(this).parent().children("td[data-eresult_subject]").data('eresult_subject');
            var value_eresult_subject = $(this).parent().children("td[data-eresult_subject]").html();
            var title_exam_start_time = $(this).parent().children("td[data-exam_start_time]").data('exam_start_time');
            var value_exam_start_time = $(this).parent().children("td[data-exam_start_time]").html();
            var title_exam_end_time = $(this).parent().children("td[data-exam_end_time]").data('exam_end_time');
            var value_exam_end_time = $(this).parent().children("td[data-exam_end_time]").html();
            var _type = $(this).parent().find('td').last().html().trim();

            if( $.isNumeric(ID) && MAIN != 0 && MAIN != 3)
            {
                var ajaxUrl = '/'+lang+'/subject';
                $.ajax({
                    type: 'POST',
                    data: 'id='+ID,
                    url: ajaxUrl,
                    cache: false,
                    processData: false,
                    beforeSend: function()
                    {
                        $('#applyPopup').html('');
                    },
                    success: function(data)
                    {
                        $('#applyPopup').html(data);
                        var modal = $('#modal3');
                        var titleOld = modal.find('.modal-header .modal-title').html();
                        var headerTH = title_exam_start_time+' : '+value_exam_start_time+' / '+title_exam_end_time+' : '+value_exam_end_time;
                        modal.find('.modal-header .modal-title').html(titleOld+' - '+value_eresult_subject);
                        modal.find('.modal-body table thead tr').first().children('th').eq(1).html(headerTH);
                        modal.modal('show');
                    }
                });
            }
        }
    });



    /**Fayl menusu ucun**/

    $('body').on( 'change', '#subject', function( event ) {


        var id = $( this ).val();
        var data_subj = $(this).find(':selected').attr('data-subject');
        var ajaxUrl = '/'+lang+'/getTeahersBySubject';
        var selectObj = $("#teacherList");

                $.ajax({
               type: 'POST',
                data:'id='+id+'&data-subject='+data_subj,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                    {

                    },
                success: function(data)
                {

                     selectObj.html(data);

                }
            });


        return false;
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    /**Appelyasiya ucun yazilan*/
    
    //Sikayetin tipi
    $("body").on('change','#complaintType',function (event) {

         var complaintTypeVal=$(this).val();

        var getNext=$(this).parent().parent().nextAll();

        for(i=0;i<=getNext.length;i++){
            var getId=$(getNext[i]).attr("id");
            $("#"+getId+' select').val('')

        }
         //Imtahanlar bagli
         if(complaintTypeVal == 40102)
         {
            $("#forComplaintSubType").hide();
            
            $("#forEXAM_TYPE").show();
            $("#forEXAM_FORM").show();
            $("#forCOMPLAINT_CATEGORY").show();
            $("#forEXAM_DATE").show();
            $("#forEXAM_BALL").show();
            $("#forTOTAL_SCORE").show();
            $("#complaintCategoryTable").hide();
            $("#complaintCategoryTableFromOther").hide();
            $("#complaintCategoryTextArea").hide();
            
            
            var ajaxUrl = '/'+lang+'/getComplaintType';
            $.ajax({
                type: 'POST',
                data:'complaintTypeVal='+complaintTypeVal,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    $("#examType").html();
                },
                success: function(data)
                {
                    $("#examType").html(data);
                }
            });
         }
         //Imtahana qederle bagli
         else if(complaintTypeVal == 40101)
         {
            $("#forComplaintSubType").show();
            
            $("#forEXAM_TYPE").hide();
            $("#forEXAM_FORM").hide();
            $("#forCOMPLAINT_CATEGORY").hide();
            $("#forEXAM_DATE").hide();
            $("#forEXAM_BALL").hide();
            $("#forTOTAL_SCORE").hide();
            $("#complaintCategoryTable").hide();
            $("#complaintCategoryTableFromOther").hide();
            $("#complaintCategoryTextArea").hide();
            
         }
        
       
    });


    
    
    //Sikayetin kateqoriyasi
    $("body").on('change','#complaintCategory',function (event) {
        
         var complaintCategoryVal=$(this).val();
         var subjectId = $("#subjGroupId").val();
         var examForm = $("#examForm").val();
         var complaintType = $("#complaintType").val();
         var examType = $("#examType").val();
         //Sualdan
         if(complaintCategoryVal == 40062 && complaintType == 40102)
         {
            var ajaxUrl = '/'+lang+'/getcomplaintCategoryApplys';
            $.ajax({
                type: 'POST',
                data:'complaintCategoryVal='+complaintCategoryVal+'&subjectId='+subjectId+'&examType='+examType,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
    
                },
                success: function(data)
                {
                    $("#complaintCategoryTable").html(data);
                }
            });
            $("#complaintCategoryTable").show();
            $("#complaintCategoryTextArea").hide();
            $("#complaintCategoryTableFromOther").hide();
         }
         //Texniki
         else if(complaintCategoryVal == 40061 && complaintType == 40102)
         {
            $("#complaintCategoryTable").hide();
            $("#complaintCategoryTextArea").show();
            $("#complaintCategoryTableFromOther").hide();
           
         }
        //Imtahana qeder bal ,elektron formada kecirlen ,sikayet texniki
         else if(complaintCategoryVal == 40061 && complaintType == 40101 && examForm==40042)
         {
            $("#complaintCategoryTable").hide();
            $("#complaintCategoryTableFromOther").hide();
            $("#complaintCategoryTextArea").show();
            $("#complaintCategoryTableFromOther").hide();
         }
         //Imtahana qeder bal ,elektron formada kecirlen ,sikayet sualdan
         else if(complaintCategoryVal == 40062 && complaintType == 40101 && examForm==40042)
         {
            
            var ajaxUrl = '/'+lang+'/getcomplaintCategoryApplys';
            $.ajax({
                type: 'POST',
                data:'complaintCategoryVal='+complaintCategoryVal+'&subjectId='+subjectId+'&examType='+examType,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    $("#complaintCategoryTable").html()
                },
                success: function(data)
                {
                    $("#complaintCategoryTable").html(data);
                }
            });
            
            
            $("#complaintCategoryTableFromOther").hide();
            $("#complaintCategoryTable").show();
            $("#complaintCategoryTextArea").hide();
           
         }
    });
    

    
    //Imtahanin kecirilme formasi
    $("body").on('change','#examForm',function (event) {
        var getNext=$(this).parent().parent().nextAll();

        for(i=0;i<=getNext.length;i++){
            var getId=$(getNext[i]).attr("id");
            $("#"+getId+' select').val('')

        }

         var examFormVal=$(this).val();
         var complaintType = $("#complaintType").val();
         var subjId = $("#subject").val();
         var examType = $("#examType").val();
         var nameEduSemester = $("#nameEduSemester").val();
          
         var ajaxUrl = '/'+lang+'/getExamResults';
         var subjGroupIdObj = $("#subjGroupId");
         //Elektron
         if(examFormVal == 40042 && complaintType==40102)
         {
            $("#forComplaintSubType").show();
            $("#forCOMPLAINT_CATEGORY").show();
            $("#forComplaintSubType").hide();
            $("#forEXAM_DATE").show();
            $("#forEXAM_BALL").show();
            $("#forTOTAL_SCORE").show();
            $("#complaintCategoryTableFromOther").hide();
         }
         //Yazili
         else if(examFormVal == 40041 && complaintType==40102)
         {
            $("#forComplaintSubType").hide();
            $("#forCOMPLAINT_CATEGORY").hide();
            $("#complaintCategoryTable").hide();
            $("#complaintCategoryTextArea").show();
            $("#complaintCategoryTableFromOther").hide();
            
         }
         
         
          //Yazili ,imtahana qederbal
         else if(examFormVal == 40041 && complaintType==40101)
         {
            $("#forComplaintSubType").show();
            $("#complaintCategory").show();
            $("#forCOMPLAINT_CATEGORY").hide();
            $("#complaintCategoryTable").hide();
            $("#complaintCategoryTextArea").show();
            $("#complaintCategoryTableFromOther").hide();
            
         }
         
         else if(examFormVal == 40042 && complaintType==40101)
         {
            $("#forComplaintSubType").show();
            $("#forCOMPLAINT_CATEGORY").show();
            $("#complaintCategoryTable").show();
            $("#complaintCategoryTextArea").hide();
            $("#complaintCategoryTableFromOther").hide();
            
         }
        
                    
         
        $.ajax({
            type: 'POST',
            data:'examType='+examType+'&examFormVal='+examFormVal+'&subjId='+subjId+'&nameEduSemester='+nameEduSemester, 
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                /*$("#examDate").val('');
                $("#examScore").val('');
                $("#totalScore").val('');*/
                subjGroupIdObj.html('');
            },
            success: function(data)
            {
                /*var obj = ( typeof(data) == 'string' ) ? $.MParseJSON(data) : data;
                var examDate = obj.examDate;
                var examScore = obj.examScore;
                var examTotalScore = obj.examTotalScore;
                
                $("#examDate").val(examDate);
                $("#examScore").val(examScore);
                $("#totalScore").val(examTotalScore);*/
                subjGroupIdObj.html(data);
                
            }
        });
    
    });
    
    
    
    
    
    
    
    
    
    
    //Sikayet alt tipi deyiiserken,
    $("body").on('change','#complaintSubType',function (event) {
        
         var complaintSubTypeVal=$(this).val();
        
         //Diger
         if(complaintSubTypeVal == 40082)
         {
            $("#forEXAM_TYPE").hide();
            $("#forEXAM_FORM").hide();
            $("#complaintCategoryTable").hide();
            $("#forCOMPLAINT_CATEGORY").hide();
            $("#forEXAM_DATE").hide();
            $("#forEXAM_BALL").hide();
            $("#complaintCategoryTextArea").hide();
            $("#complaintCategoryTableFromOther").show();
            
            var ajaxUrl = '/'+lang+'/getComplaintOtherType';
            $.ajax({
                type: 'POST',
                data:'complaintSubTypeVal='+complaintSubTypeVal,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    $("#complaintCategoryTableFromOther").html();
                },
                success: function(data)
                {
                    $("#complaintCategoryTableFromOther").html(data);
                }
            });
            
            
         }
         //Kollokvum bali
         else if(complaintSubTypeVal == 40081)
         {
            $("#forEXAM_TYPE").show();
            $("#forEXAM_FORM").show();
            $("#forCOMPLAINT_CATEGORY").show();
            $("#forEXAM_DATE").show();
            $("#forEXAM_BALL").show();
            $("#complaintCategoryTableFromOther").hide();
            
            var ajaxUrl = '/'+lang+'/getComplaintSubType';
            $.ajax({
                type: 'POST',
                data:'complaintSubTypeVal='+complaintSubTypeVal,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    $("#examType").html();
                },
                success: function(data)
                {
                    $("#examType").html(data);
                }
            });
        
         }
        
        
    });
    
    
    
    //Fenn combo deyiiserken,
    $("body").on('change','#subject',function (event) {
        
         /*var subjectVal=$(this).val();
         var examForm = $("#examForm").val();
         //Kollokvum bali
        var ajaxUrl = '/'+lang+'/getsubject';
            $.ajax({
                type: 'POST',
                data:'subjectVal='+subjectVal+'&examForm='+examForm,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    //$("#subjGroupId").html();
                    $("#examDate").val(examDate);
                    $("#examScore").val(examScore);
                    $("#totalScore").val(examTotalScore);
                },
                success: function(data)
                {
                    var obj = ( typeof(data) == 'string' ) ? $.MParseJSON(data) : data;
                    var examDate = obj.examDate;
                    var examScore = obj.examScore;
                    var examTotalScore = obj.examTotalScore;
                    
                    $("#examDate").val(examDate);
                    $("#examScore").val(examScore);
                    $("#totalScore").val(examTotalScore);
                }
            });*/
        
    });
         
    
    
    //Fenn qrupu combo deyiiserken,
    $("body").on('change','#subjGroupId',function (event) {
        
        var subjectVal=$(this).val();
        var examForm = $("#examForm").val();
         //Kollokvum bali
        var ajaxUrl = '/'+lang+'/getsubject';
            $.ajax({
                type: 'POST',
                data:'subjectVal='+subjectVal+'&examForm='+examForm,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    //$("#subjGroupId").html();
                    $("#examDate").html();
                    $("#examScore").html();
                    $("#totalScore").html();
                },
                success: function(data)
                {
                    var obj = ( typeof(data) == 'string' ) ? $.MParseJSON(data) : data;
                    var examDate = obj.examDate;
                    var examScore = obj.examScore;
                    var examTotalScore = obj.examTotalScore;
                    
                    $("#examDate").val(examDate);
                    $("#examScore").val(examScore);
                    $("#totalScore").val(examTotalScore);
                }
            });
        
    });
    
    
    
    //Kollokvium combo deyiiserken,
    $("body").on('change','#examType',function (event) {

        var getNext=$(this).parent().parent().nextAll();

        for(i=0;i<=getNext.length;i++){
            var getId=$(getNext[i]).attr("id");
            $("#"+getId+' select').val('')

        }
         var subjGroupId=$("#subjGroupId").val();
         var collocviumId=$(this).val();
         
         var complaintType = $("#complaintType").val();
         var complaintSubType =$("#complaintSubType").val();
         //Kollokvum bali
         var ajaxUrl = '/'+lang+'/getCollocviumResults';
         if(complaintType==40101 && complaintSubType==40081) 
         { 
            $.ajax({
                type: 'POST',
                data:'collocviumId='+collocviumId+'&subjGroupId='+subjGroupId,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    $("#examDate").val('');
                    $("#examScore").val('');
                },
                success: function(data)
                {
                    var obj = ( typeof(data) == 'string' ) ? $.MParseJSON(data) : data;
                    var examDate = obj.examDate;
                    var examScore = obj.examScore;
                    
                    $("#examDate").val(examDate);
                    $("#examScore").val(examScore);
                    
                }
            });
        }
    });
    
    
    
    
     /*Apelyasiya insert**/
    
     $("body").on('click','#sendAppeal',function (event) {
        
        var comission_emp_id = $( "#whom" ).data( "id" );
        var enterance_id = $("#subjGroupId").val();
        var subjGroupId  = $("#subjGroupId option:selected").data('subjgrid');
        var complaintType = $("#complaintType").val();
        var complaintSubType = $("#complaintSubType").val()
        var complaintCategory = $("#complaintCategory").val();
        var examForm = $("#examForm").val();
        var examType = $("#examType").val();
        var complainText = $("#complainTextArea").val();
        var nameEduSemester = $("#nameEduSemester").val();
        
        //Imtahanlardan, elektron ,sualdan
        if(complaintType==40102 && examForm==40042 && complaintCategory==40062)
        {
           var data ='comission_emp_id='+comission_emp_id+'&nameEduSemester='+nameEduSemester+'&subjGroupId='+subjGroupId+'&examType='+examType+'&complaintType='+complaintType+'&complaintCategory='+complaintCategory+'&examForm='+examForm+'&errorType=examElecQuest'+'&enterance_id='+enterance_id;
        }
        
        //Imtahanlardan, elektron ,texniki
        else if(complaintType==40102 && examForm==40042 && complaintCategory==40061)
        {
           var data ='comission_emp_id='+comission_emp_id+'&nameEduSemester='+nameEduSemester+'&subjGroupId='+subjGroupId+'&examType='+examType+'&complaintType='+complaintType+'&complaintCategory='+complaintCategory+'&examForm='+examForm+'&examType='+examType+'&complaintText='+complainText+'&errorType=examElecTech'+'&enterance_id='+enterance_id;
        }
        
        //Imtahanlardan, yazili
        else if(complaintType==40102 && examForm==40041)
        {
            var data = 'complaintType='+complaintType+'&nameEduSemester='+nameEduSemester+'&examForm='+examForm+'&complaintText='+complainText+'&examType='+examType+'&comission_emp_id='+comission_emp_id+'&subjGroupId='+subjGroupId+'&errorType=examWritten'+'&enterance_id='+enterance_id;
        }
        
        //Imtahana qeder bal , diger
        else if(complaintType==40101 && complaintSubType==40082)
        {
            var data = 'complaintSubType='+complaintSubType+'&nameEduSemester='+nameEduSemester+'&complaintType='+complaintType+'&comission_emp_id='+comission_emp_id+'&subjGroupId='+subjGroupId+'&errorType=toExamOther'+'&enterance_id='+enterance_id;
        } 
        
       //Imtahanlara qeder bal,kollokvum bali,yazili
        else if(complaintType==40101 && complaintSubType==40081 && examForm==40041)
        {
            var data = 'complaintType='+complaintType+'&nameEduSemester='+nameEduSemester+'&examForm='+examForm+'&complaintSubType='+complaintSubType+'&examType='+examType+'&comission_emp_id='+comission_emp_id+'&subjGroupId='+subjGroupId+'&complaintText='+complainText+'&errorType=toExamColWritten'+'&enterance_id='+enterance_id;
        }
       
        //Imtahanlara qeder bal,kollokvum bali,elektron,sualdan
        else if(complaintType==40101 && complaintSubType==40081 && examForm==40042 && complaintCategory==40062)
        {
            var data = 'complaintType='+complaintType+'&nameEduSemester='+nameEduSemester+'&examForm='+examForm+'&complaintSubType='+complaintSubType+'&examType='+examType+'&complaintCategory='+complaintCategory+'&comission_emp_id='+comission_emp_id+'&subjGroupId='+subjGroupId+'&errorType=toExamColElecQuest'+'&enterance_id='+enterance_id;
        }
        
        //Imtahanlara qeder bal,kollokvum bali,elektron,texniki
        else if(complaintType==40101 && complaintSubType==40081 && examForm==40042 && complaintCategory==40061)
        {
            var data = 'complaintType='+complaintType+'&nameEduSemester='+nameEduSemester+'&examForm='+examForm+'&complaintSubType='+complaintSubType+'&examType='+examType+'&complaintCategory='+complaintCategory+'&comission_emp_id='+comission_emp_id+'&subjGroupId='+subjGroupId+'&complaintText='+complainText+'&errorType=toExamColElecTech'+'&enterance_id='+enterance_id;
        }
        
        var ajaxUrl = '/'+lang+'/submitAppealPopup';
        $.ajax({
            type: 'POST',
            data:data,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            { console.log("Semaye_test");
                //$(".load-apply").show();
            },
            success: function(data)
            {  console.log("Semaye_test");
              // $(".load-apply").hide(); 
               var obj = ( typeof(data) == 'string' ) ? $.MParseJSON(data) : data;
               var examDate = obj.examDate;
               
                
               if(obj.success=="ok") 
               {
                  $('#modalAppeal').modal('hide');
                  window.location.reload();
                  alert(obj.successAlert);
               }
               
               if(obj.errorRepeat) 
               {
                  alert(obj.errorRepeat);  
               }
               
               if(obj.errorThreeDay) 
               {
                  alert(obj.errorThreeDay);  
               }
               
               if(obj.errorFiveDay) 
               {
                  alert(obj.errorFiveDay);  
               }
               
               
               if(obj.examElecQuestError) 
               {
                  alert(obj.examElecQuestError);  
               }
               if(obj.examElecTech) 
               {
                  alert(obj.examElecTech);  
               }
               if(obj.examWritten) 
               {
                  alert(obj.examWritten);  
               }
               if(obj.toExamOther) 
               {
                  alert(obj.toExamOther);  
               }
               if(obj.toExamColWritten) 
               {
                  alert(obj.toExamColWritten);  
               }
               if(obj.toExamColElecQuest) 
               {
                  alert(obj.toExamColElecQuest);  
               }
               if(obj.toExamColElecTech) 
               {
                  alert(obj.toExamColElecTech);  
               }
               if(obj.emptyPost) 
               {
                  alert(obj.emptyPost);  
               }
            }
        });
    });
    
    /*Apelyasiya sualdan sikayet insert**/ 
    
     $("body").on('click','#sendQuestionAppeal',function (event) {
        
        var question_id = $('input[name=radio]:checked').data('id');
        var complainText = $("#complaintFormQuestionspopup").val();
        var examType=$("#examType").val();
        var subjGroupId=$("#subjGroupId").val();
        
        var data = 'question_id='+question_id+'&complainText='+complainText+'&examType='+examType+'&subjGroupId='+subjGroupId; 
       
        
        var ajaxUrl = '/'+lang+'/sendQuestionAppealVal';
        if(complainText && question_id)
        {
            $.ajax({
                type: 'POST',
                data:data,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                  $(".load-apply").show();
                  $("#complaintCategoryTable").html('');  
                },
                success: function(data)
                {  $(".load-apply").hide();
                   $('#modalQuestion').modal('hide'); 
                   $("#complaintCategoryTable").html(data); 
                }
            });
        }
        else
        {
            alert("Şikayət mətni v? sual boş ola bilməz");
        }
        
    });

    $("#applyPopup").on("hidden.bs.modal", function () {
        var getModalList=$("#applyPopup>div:visible").length;
        if($("#applyPopup").hasClass("forAppealModal")==true &&getModalList==0){
            var ajaxUrl = '/'+lang+'/cleanSession';
            var data ='clean=clean';
            $.ajax({
                type: 'POST',
                data:data,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {

                },
                success: function(data)
                {

                }
            });
        }

    });
    
    
      /*sUALLar popup**/
    $("body").on( "click", "#appealFromQuestion", function( event ) {
        
        var examType = $("#examType").val();
        var subjGroupId =$("#subjGroupId").val();
        var data = 'examType='+examType+'&subjGroupId='+subjGroupId;
        var ajaxUrl = '/'+lang+'/appealFromQuestion';
        if (subjGroupId == '-- Fənn üzrə qrupu seçin --'){
            alert('Fənn üzrə qrupu seçin');
            return
        }
        $.ajax({
            type: 'POST',
            data: data,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                //$('#applyPopup').html('');

            },
            success: function(data)
            {
                $('#modalQuestion').remove();
                $('#applyPopup').append(data);
                $('#modalQuestion').modal('show');
            }
        });
    });
    
   
   $("body").on( "click", "a.delete", function(event){
    
      var subjectId = $("#subjGroupId").val(); 
      var examType = $("#examType").val();
      var data = 'subjectId='+subjectId+'&examType='+examType;
      
      var ajaxUrl = $(this).attr('href');
      $.ajax({
            type: 'POST',
            data:data,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                $("#complaintCategoryTable").html('');
            },
            success: function(data)
            {
                
                $("#complaintCategoryTable").html(data);
            }
      });
      return false;
    
    });
    
    
    $("body").on( "click", "a.edit", function(event){
    
      var subjectId = $("#subjGroupId").val(); 
      var examType = $("#examType").val();
      var data = 'subjectId='+subjectId+'&examType='+examType;
      
      var ajaxUrl = $(this).attr('href');
      $.ajax({
            type: 'POST',
            data:data,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                
            },
            success: function(data)
            {
                $('#applyPopup').append(data);
                $("#modalEditComplain").modal('show');
            }
      });
      return false;
    
    });
    
    
    $("body").on( "click","#editQuestionAppeal", function(event){
    
      var id= $(this).data('id');
      var newText = $("#complaintFormQuestionspopupEdit").val();
      var subjectId = $("#subjGroupId").val(); 
      var examType = $("#examType").val();
      var data = 'id='+id+'&text='+newText+'&subjectId='+subjectId+'&examType='+examType;
      
      var ajaxUrl = '/'+lang+'/appealFromQuestionEdit';
      $.ajax({
            type: 'POST',
            data:data,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                $(".load-apply").show();
                $("#complaintCategoryTable").html('');
                $("#modalEditComplain").modal('hide');
            },
            success: function(data)
            {
                $(".load-apply").hide();
                $("#complaintCategoryTable").html(data);
            }
      });
      return false;
    
    });
    
    
    
    
    
    /*Otherden sikayet edende**/
    $("body").on( "click", "#appealFromOtherQuestion", function( event ) {
        
        var examType = $("#examType").val();
        var subjGroupId =$("#subjGroupId").val();
        var data = 'examType='+examType+'&subjGroupId='+subjGroupId;
        var ajaxUrl = '/'+lang+'/appealFromOtherQuestion';

        $.ajax({
            type: 'POST',
            data: data,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                //$('#applyPopup').html('');
                
            },
            success: function(data)
            {
                $('#modalOtherQuestion').remove();
                $('#applyPopup').append(data);
                $('#modalOtherQuestion').modal('show');
            }
        });
    });
    
    
    $("body").on('click','#sendOtherQuestionAppeal',function (event) {
        
        var complainOtherText = $("#complainOtherTextArea").val();
        var otherApplyType = $("#otherApplyType").val();
        
        var data = 'otherApplyType='+otherApplyType+'&complainOtherText='+complainOtherText; 
       
        
        var ajaxUrl = '/'+lang+'/sendOtherQuestionAppealVal';
        $.ajax({
            type: 'POST',
            data:data,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                $(".load-apply").show();
              $("#complaintCategoryTableFromOther").html('');  
            },
            success: function(data)
            {
               if(data!=='error') 
               {
                  $('#modalOtherQuestion').modal('hide'); 
                  $("#complaintCategoryTableFromOther").html(data); 
               }
               else
               {
                 $("#textAreaError").show();
               }
                $(".load-apply").hide();
            }
        });
    });
    
    
    $("body").on( "click", "a.deleteOther", function(event){
    
     
      var data = 'delete=delete';
      
      var ajaxUrl = $(this).attr('href');
      $.ajax({
            type: 'POST',
            data:data,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                $("#complaintCategoryTableFromOther").html('');
            },
            success: function(data)
            {
                
                $("#complaintCategoryTableFromOther").html(data);
            }
      });
      return false;
    
    });
    
    
   
    $("body").on( "click", "a.editOther", function(event){
   
      var examType = $("#examType").val();
      var subjGroupId =$("#subjGroupId").val();
      var data = 'examType='+examType+'&subjGroupId='+subjGroupId;
      
      var ajaxUrl = $(this).attr('href');
      $.ajax({
            type: 'POST',
            data:data,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                
            },
            success: function(data)
            {
                $('#applyPopup').append(data);
                $("#modalOtherQuestionEdit").modal('show');
            }
      });
      return false;
    
    });
    
    
    $("body").on('click','#sendOtherQuestionAppealEdit',function (event) {
        
        var complainOtherText = $("#complainOtherTextAreaEdit").val();
        var otherApplyType = $("#otherApplyType").val();
        var id = $(this).attr('data-id');
        
        var data = 'id='+id+'&otherApplyType='+otherApplyType+'&complainOtherText='+complainOtherText; 
       
        
        var ajaxUrl = '/'+lang+'/sendOtherQuestionAppealValEdit';
        $.ajax({
            type: 'POST',
            data:data,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                $(".load-apply").show();
              $("#complaintCategoryTableFromOther").html('');  
            },
            success: function(data)
            {  $(".load-apply").hide();
               $('#modalOtherQuestionEdit').modal('hide'); 
               $("#complaintCategoryTableFromOther").html(data); 
            }
        });
    });
    
    
    
    
    
    
    
    
    $('#studentAppeal-grid> .table > tbody > tr > td ').not('.button-column').click(function(  ) {

        if( $(this).parent().children("td:nth-child(2)").is(':hidden') )
        {
            var ID = $(this).parent().children("td:nth-child(2)").html().trim();
            var appealType = $(this).parent().children("td:nth-child(3)").html().trim();
            var isWritten = $(this).parent().children("td:nth-child(4)").html().trim();
            var isOther = $(this).parent().children("td:nth-child(5)").html().trim();
            if( $.isNumeric(ID) )
            {
                var ajaxUrl = '/'+lang+'/viewAppealMore';
                $.ajax({
                    type: 'POST',
                    data: 'id='+ID+'&appealType='+appealType+'&isWritten='+isWritten+'&isOther='+isOther,
                    url: ajaxUrl,
                    cache: false,
                    processData: false,
                    beforeSend: function()
                    {
                        $('#applyPopup').html('');
                    },
                    success: function(data)
                    {
                        $('#applyPopup').html(data);
                        $('#modalAppealMore').modal('show');
                    }
                });
            }
        }
    });
    
    
    
    $('body').on( 'click', '.forNoteRead', function( event ) {

        
        //var ID = $(this).attr('data-id');
        
        var ajaxUrl = $(this).attr('href');
        
        $.ajax({
            type: 'POST',
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                $('#applyPopup').html('');
            },
            success: function(data)
            {
                $('#applyPopup').html(data);
                $('#modalAppealMore').modal('show');
            }
        });
        return false;
        
    });
    
    /**Appelyasiya ucun yazilan end*/




    /*Serbest is*/
        
    $('body').on( 'change', '#eduSemesterIndependent', function( event ) {


        var id = $( this ).val();
        var ajaxUrl = '/'+lang+'/getSubGroupInd';
        var selectObj = $("#lessonTypeIndependent");

        $.ajax({
           type: 'POST',
            data:'id='+id,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {

            },
            success: function(data)
            {

                 selectObj.html(data);

            }
        });


        return false;
    });
/*    $('body').on( 'change', '#eduSemesterFiles', function( event ) {


        var id = $( this ).val();
        var ajaxUrl = '/'+lang+'/getSubGroupFiles';
        var selectObj = $("#subject");

        $.ajax({
           type: 'POST',
            data:'id='+id,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {

            },
            success: function(data)
            {

                 selectObj.html(data);

            }
        });


        return false;
    });*/
    
    /*
    
    $('#independentworks-grid> .table > tbody > tr > td ').click(function(  ) {
        var getvalSubject= $("#lessonTypeIndependent").val();
        var getActiveVal=$("option[value='"+getvalSubject+"']").data("active");

        if( $(this).parent().children("td:nth-child(2)").is(':hidden') )
        {
            var ID = $(this).parent().children("td:nth-child(2)").html().trim();
            var REAL_ID = $(this).parent().children("td:nth-child(3)").html().trim();
            var SCORE = $(this).parent().children("td:nth-child(4)").html().trim();
            var DENIAL_NOTE = $(this).parent().children("td:nth-child(5)").html().trim();
            var NOTE = $(this).parent().children("td:nth-child(6)").html().trim();
            var IS_DOWNLOADED = $(this).parent().children("td:nth-child(7)").html().trim();
            var THEME = $(this).parent().children("td:nth-child(8)").html().trim();
            var semestrid = $("#eduSemesterIndependent").val();
            
            var  data = 'id='+ID+'&real_id='+REAL_ID+'&score='+SCORE+'&denial_note='+DENIAL_NOTE+'&note='+NOTE+'&is_downloaded='+IS_DOWNLOADED+'&theme='+THEME+'&semestrid='+semestrid;
            if(getActiveVal==2 && (SCORE==0||SCORE==3||SCORE== null||SCORE== undefined||isNaN(+SCORE))){
                alert("Fən üzrə qrupp bağlıdır");
            }else{

            if( $.isNumeric(ID))
            {
                var ajaxUrl = '/'+lang+'/independentworksPopup';
                $.ajax({
                    type: 'POST',
                    data: data,
                    url: ajaxUrl,
                    cache: false,
                    processData: false,
                    beforeSend: function()
                    {
                        $('#applyPopup').html('');
                    },
                    success: function(data)
                    {
                        $('#applyPopup').html(data);
                        $('#modal11').modal('show');
                    }
                });
            }
        }
        }
    });*/
    
    
    
    $('body').on( 'click', '#independentDownload', function( event ) {


        var ajaxUrl = '/'+lang+'/independentDownload';

        var selectedThemeId = $(this).attr('data-themeId');


        var data = new FormData();
            data.append('selectedThemeId',selectedThemeId);

      $.ajax({
            type: 'POST',
            data: data,
            url: ajaxUrl,
            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function()
            {

            },
            success: function(data)
            {

              var arr = data.split('/');
              window.location.href = "downloadIndependentOneFile/"+arr[0];

            }
        });

    return false;

    });
    
    
    $('body').on( 'click', '#delUploadIndepent', function( event ) {


        var ajaxUrl = '/'+lang+'/delIndepentFile';
        var id = $(this).attr('data-themeId');;

        $.ajax({
           type: 'POST',
            data:'id='+id,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                $("#fileformlabel").html('');
            },
            success: function()
            {

               //  $(".delUploadIndepent").hide();
            }
        });


        return false;
    });
    
    /*Serbest is end**/


        $('body').on( 'click', '.button_sylabus', function( event ) {


        var ajaxUrl = '/'+lang+'/downloadSillabus';

        var selectedSubjPath = $("#teacherList").find(':selected').attr('data-sylabus');

          var data = new FormData();
            data.append('selectedSubjPath',selectedSubjPath);



        if(selectedSubjPath == 0||selectedSubjPath==undefined)
        {
            alert('Sillabus yuklenilmemisdir');
        }
        else
        {
            $.ajax({
                type: 'POST',
                data: data,
                url: ajaxUrl,
                cache: false,
                processData: false,
                contentType: false,
                beforeSend: function()
                {

                },
                success: function(data)
                {
                  window.location.href = "downloadSyl/"+data;
                }
            });
        }
        return false;

    });
/*
        $('body').on( 'click', '#downloadTests', function( event ) {


        var ajaxUrl = '/'+lang+'/downloadTest';

        var testsID = $(this).attr('data-id');

          var data = new FormData();
            data.append('testsID',testsID);



     //   if( testsID  == 0|| testsID ==undefined)
     //   {
      //      alert('TestlÃ‰â„¢r yuklenilmemisdir');
     //   }
      //  else
     //   {
            $.ajax({
                type: 'POST',
                data: data,
                url: ajaxUrl,
                cache: false,
                processData: false,
                contentType: false,
                beforeSend: function()
                {

                },
                success: function(data)
                {
                    window.location.href = "downloadTest"+testsID;
                }
            });
      //  }
        return false;

    });*/

      $('body').on( 'click', '#files-grid> .table > tbody > tr > td', function( event ) {

        if( $(this).parent().children("td:nth-child(2)").is(':hidden') )
        {
            var ID = $(this).parent().children("td:nth-child(2)").html().trim();
            if( $.isNumeric(ID) )
            {
                var ajaxUrl = '/'+lang+'/fdownloadSubj';
                $.ajax({
                    type: 'POST',
                    data: 'id='+ID,
                    url: ajaxUrl,
                    cache: false,
                    processData: false,
                    beforeSend: function()
                    {
                        $('#applyPopup').html('');
                    },
                    success: function(data)
                    {
                        $('#applyPopup').html(data);
                        $('#modal10').modal('show');
                    }
                });
            }
        }
    });



     $('body').on( 'click', '.themeDownload', function( event ) {


        var ajaxUrl = '/'+lang+'/downloadFileForTheme';

        var selectedFileType = $(this).attr('data-fileType');
        var selectedThemeId = $(this).attr('data-themeId');


        var data = new FormData();
            data.append('selectedFileType',selectedFileType);
            data.append('selectedThemeId',selectedThemeId);

      $.ajax({
            type: 'POST',
            data: data,
            url: ajaxUrl,
            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function()
            {

            },
            success: function(data)
            {

              var arr = data.split('/');
              window.location.href = "downloadOneFile/"+arr[0]+'/'+arr[1];

            }
        });

    return false;

    });
    
    
    
/*    $('body').on( 'click', '#addIndependWorkFile', function( event ) {

        $(".load-apply2").show();
        var selectObj = $("#errorFileIndepent");
        var file_data = $('#uploadIndepend').prop('files')[0];
        var real_id = $(this).attr('data-id');
        var f_id = $(this).attr('data-fid');
        var score = $(this).attr('data-score');
        var data = new FormData();
            data.append('file',file_data);
            data.append('real_id',real_id);
            data.append('f_id',f_id);
            data.append('score',score);
        var ajaxUrl = '/'+lang+'/addIndependentWork';
        
       $.ajax({
                type: 'POST',
                data:data ,
                url: ajaxUrl,
                cache: false,
                processData: false,
                contentType: false,
                beforeSend: function()
                {
                    $('#errorFile').html('');
                },
                success: function(data)
                {

                    if(data==0)
                    {
                        window.location.reload(true);
                    }
                    else
                    {
                        selectObj.html(data);
                        $(".load-apply2").hide();
                    }

                }
        });


        return false;

    });*/

    $("body").on( "click", "#newIndWorks,#independentworks-grid> .table > tbody > tr > td", function( event ) {
        var getId=$(this).attr('id');
        var grid_id='';
        var file_path='';
        var themeVal='';
        var themeName='';
        var isDownloaded='';
        var isExpired='';
        var ajaxUrl =  '/'+lang+'/independentworksPopup';
        var subjGroupID= $("#lessonTypeIndependent").val();
        if(getId=='newIndWorks'){
            if ($('#lessonTypeIndependent').val() == '') {
                alert('fənn üzrə qrup seçilməyib!');
                return;
            }
        }
        else{
            grid_id= $(this).parent().children("td:nth-child(2)").html().trim();
            file_path= $(this).parent().children("td:nth-child(3)").html().trim();
            isDownloaded= $(this).parent().children("td:nth-child(4)").html().trim();
            isExpired= $(this).parent().children("td:nth-child(5)").html().trim();
            themeVal= $(this).parent().children("td:nth-child(6)").html().trim();
            themeName= $(this).parent().children("td:nth-child(7)").html().trim();

        }
        var data='subjGroupID='+ subjGroupID+'&themeVal='+themeVal+'&themeName='+themeName+'&isDownloaded='+isDownloaded+'&isExpired='+isExpired+'&file_path='+file_path+'&grid_id='+grid_id;
        $.ajax({
            type: 'POST',
            data:data,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                $('#applyPopup').html('');
            },
            success: function(data)
            {
                $('#applyPopup').html(data);
                $('#modalFileForm').modal('show');
            }
        });

        return false;
    });
    $('body').on( 'click', '#addIndependWorkFile', function( event ) {

        $(".load-apply2").show();
        var selectObj = $("#errorFileIndepent");
        var file_data = $('#uploadIndepend').prop('files')[0];

        var dataID=$(this).data("id");
        if(dataID==0){
            var themeId=$("#themeIndWorks").val();
        }else{
            var themeId=$("#themeIndWorks").data("id");

        }
        var data = new FormData();
            data.append('themeId',themeId);
            data.append('file',file_data);
            data.append('dataID',dataID);
        var ajaxUrl = '/'+lang+'/addIndependentWork';

       $.ajax({
                type: 'POST',
                data:data ,
                url: ajaxUrl,
                cache: false,
                processData: false,
                contentType: false,
                beforeSend: function()
                {
                    $('#errorFile').html('');
                },
                success: function(data)
                {

                    if(data==0)
                    {
                        window.location.reload(true);
                    }
                    else
                    {
                        selectObj.html(data);
                        $(".load-apply2").hide();
                    }

                }
        });


        return false;

    });
    /***/


    $('body').on( 'change', '#ManApply_DICT_COUNTRY_ID_0, #ManApplyEduSec_DICT_COUNTRY_ID1', function( event ) {
        var val = $(this).val();
        var sID = $(this).attr('id');
        var selectObj = ( sID == 'ManApply_DICT_COUNTRY_ID_0' ) ? $('#ManApply_REGION_ID_0') : $('#ManApplyEduSec_REGION_ID1');
        var subSelectObj = ( sID == 'ManApply_DICT_COUNTRY_ID_0' ) ? $('#ManApply_SUBREGION_ID_0') : $('#ManApplyEduSec_SUBREGION_ID1');
        var ajaxUrl = '/'+lang+'/dci';

        if( val != '' )
        {
            $.ajax({
                type: 'POST',
                data: 'id='+val,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    selectObj.find('[value!=""]').remove();
                    selectObj.attr('disabled','disabled');
                    subSelectObj.find('[value!=""]').remove();
                    subSelectObj.attr('disabled','disabled');
                },
                success: function(data)
                {
                    if( data != 0 )
                    {
                        selectObj.html(data);
                        selectObj.removeAttr('disabled');
                    }
                }
            });
        }
        else
        {
            selectObj.find('[value!=""]').remove();
            selectObj.attr('disabled','disabled');
            subSelectObj.find('[value!=""]').remove();
            subSelectObj.attr('disabled','disabled');
        }
    });

    $('body').on( 'change', '#ManApply_DICT_COUNTRY_ID_1', function( event ) {
        var val = $(this).val();
        var selectObj = $('#ManApply_REGION_ID_1');
        var subSelectObj = $('#ManApply_SUBREGION_ID_1');
        var ajaxUrl = '/'+lang+'/dci';

        if( val != '' )
        {
            $.ajax({
                type: 'POST',
                data: 'id='+val,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    selectObj.find('[value!=""]').remove();
                    selectObj.attr('disabled','disabled');
                    subSelectObj.find('[value!=""]').remove();
                    subSelectObj.attr('disabled','disabled');
                },
                success: function(data)
                {
                    if( data != 0 )
                    {
                        selectObj.html(data);
                        selectObj.removeAttr('disabled');
                    }
                }
            });
        }
        else
        {
            selectObj.find('[value!=""]').remove();
            selectObj.attr('disabled','disabled');
            subSelectObj.find('[value!=""]').remove();
            subSelectObj.attr('disabled','disabled');
        }
    });

    $('body').on( 'change', '#ManApply_REGION_ID_0, #ManApplyEduSec_REGION_ID1', function( event ) {
        var val = $(this).val();
        var sID = $(this).attr('id');
        var selectObj = ( sID == 'ManApply_REGION_ID_0' ) ? $('#ManApply_SUBREGION_ID_0') : $('#ManApplyEduSec_SUBREGION_ID1');
        var ajaxUrl = '/'+lang+'/dri';

        if( val != '' )
        {
            $.ajax({
                type: 'POST',
                data: 'id='+val,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    selectObj.find('[value!=""]').remove();
                    selectObj.attr('disabled','disabled');
                },
                success: function(data)
                {
                    if( data != 0 )
                    {
                        selectObj.html(data);
                        selectObj.removeAttr('disabled');
                    }
                }
            });
        }
        else
        {
            selectObj.find('[value!=""]').remove();
            selectObj.attr('disabled','disabled');
        }
    });

    $('body').on( 'change', '#ManApply_REGION_ID_1', function( event ) {
        var val = $(this).val();
        var selectObj = $('#ManApply_SUBREGION_ID_1');
        var ajaxUrl = '/'+lang+'/dri';

        if( val != '' )
        {
            $.ajax({
                type: 'POST',
                data: 'id='+val,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    selectObj.find('[value!=""]').remove();
                    selectObj.attr('disabled','disabled');
                },
                success: function(data)
                {
                    if( data != 0 )
                    {
                        selectObj.html(data);
                        selectObj.removeAttr('disabled');
                    }
                }
            });
        }
        else
        {
            selectObj.find('[value!=""]').remove();
            selectObj.attr('disabled','disabled');
        }
    });

    $('body').on( 'change', '#ManApply_DIC_EDU_ORG_ID', function( event ) {
        var val = $(this).val();
        var selectObj = $('#ManApply_DIC_EDU_FACULTY_ID');
        var subSelectObj = $('#ManApply_DIC_EDU_PROFESSION_ID');
        var ajaxUrl = '/'+lang+'/deufi';

        if( val != '' )
        {
            $.ajax({
                type: 'POST',
                data: 'id='+val,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    //selectObj.find('[value!=""]').remove();
                    //selectObj.attr('disabled','disabled');
                    //subSelectObj.find('[value!=""]').remove();
                    //subSelectObj.attr('disabled','disabled');
                },
                success: function(data)
                {
                    if( data != 0 )
                    {
                        selectObj.html(data);
                        selectObj.removeAttr('disabled');
                    }
                }
            });
        }
        else
        {
            //selectObj.find('[value!=""]').remove();
            //selectObj.attr('disabled','disabled');
            //subSelectObj.find('[value!=""]').remove();
            //subSelectObj.attr('disabled','disabled');
        }
    });

    $('body').on( 'change', '#ManApply_DIC_EDU_TYPE_ID', function( event ) {
        var val = $(this).val();
        var selectObj = $('#ManApply_DIC_SELECTED_PROFESSION_ID');
        var ajaxUrl = '/'+lang+'/dspi';

        if( val != '' )
        {
            $.ajax({
                type: 'POST',
                data: 'id='+val,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    selectObj.find('[value!=""]').remove();
                    selectObj.attr('disabled','disabled');
                },
                success: function(data)
                {
                    if( data != 0 )
                    {
                        selectObj.html(data);
                        selectObj.removeAttr('disabled');
                    }
                }
            });
        }
        else
        {
            selectObj.find('[value!=""]').remove();
            selectObj.attr('disabled','disabled');
        }
    });

    $('body').on( 'change', '#ManApply_DIC_EDU_FACULTY_ID', function( event ) {
        var val = $(this).val();
        var selectObj = $('#ManApply_DIC_EDU_PROFESSION_ID');
        var ajaxUrl = '/'+lang+'/defi';

        if( val != '' )
        {
            $.ajax({
                type: 'POST',
                data: 'id='+val,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    //selectObj.find('[value!=""]').remove();
                    //selectObj.attr('disabled','disabled');
                },
                success: function(data)
                {
                    if( data != 0 )
                    {
                        //selectObj.html(data);
                        //selectObj.removeAttr('disabled');
                    }
                }
            });
        }
        else
        {
            selectObj.find('[value!=""]').remove();
            selectObj.attr('disabled','disabled');
        }
    });

    $('body').on( 'change', '.st_parents_yes_no', function( event ) {
        if (event.target.value == 1){
            $('#ManApplyEduFromDIM_FATHER_NAME').removeAttr('readonly');
            $('#ManApplyEduFromDIM_FATHER_SURNAME').removeAttr('readonly');
            $('#ManApplyEduFromDIM_FATHER_PHONE').removeAttr('readonly');
            $('#ManApplyEduFromDIM_MOTHER_NAME').removeAttr('readonly');
            $('#ManApplyEduFromDIM_MOTHER_SURNAME').removeAttr('readonly');
            $('#ManApplyEduFromDIM_MOTHER_PHONE').removeAttr('readonly');
            $('#ManApplyEduFromDIM_MOTHER_JOB').removeAttr('readonly');
            $('#ManApplyEduFromDIM_FATHER_JOB').removeAttr('readonly');
            $('#ManApplyEduFromDIM_GUARDIAN').attr('readonly','readonly').val('');
            $('#ManApplyEduFromDIM_GUARDIAN_PHONE').attr('readonly','readonly').val('');

        } else if (event.target.value === '0') {
            $('#ManApplyEduFromDIM_FATHER_NAME').attr('readonly','readonly').val('');
            $('#ManApplyEduFromDIM_FATHER_SURNAME').attr('readonly','readonly').val('');
            $('#ManApplyEduFromDIM_FATHER_PHONE').attr('readonly','readonly').val('');
            $('#ManApplyEduFromDIM_MOTHER_NAME').attr('readonly','readonly').val('');
            $('#ManApplyEduFromDIM_MOTHER_SURNAME').attr('readonly','readonly').val('');
            $('#ManApplyEduFromDIM_MOTHER_PHONE').attr('readonly','readonly').val('');
            $('#ManApplyEduFromDIM_MOTHER_JOB').attr('readonly','readonly').val('');
            $('#ManApplyEduFromDIM_FATHER_JOB').attr('readonly','readonly').val('');
            $('#ManApplyEduFromDIM_GUARDIAN').removeAttr('readonly');
            $('#ManApplyEduFromDIM_GUARDIAN_PHONE').removeAttr('readonly');
        } else  {
            $('#ManApplyEduFromDIM_FATHER_NAME').attr('readonly','readonly').val('');
            $('#ManApplyEduFromDIM_FATHER_SURNAME').attr('readonly','readonly').val('');
            $('#ManApplyEduFromDIM_FATHER_PHONE').attr('readonly','readonly').val('');
            $('#ManApplyEduFromDIM_MOTHER_NAME').attr('readonly','readonly').val('');
            $('#ManApplyEduFromDIM_MOTHER_SURNAME').attr('readonly','readonly').val('');
            $('#ManApplyEduFromDIM_MOTHER_PHONE').attr('readonly','readonly').val('');
            $('#ManApplyEduFromDIM_MOTHER_JOB').attr('readonly','readonly').val('');
            $('#ManApplyEduFromDIM_FATHER_JOB').attr('readonly','readonly').val('');
            $('#ManApplyEduFromDIM_GUARDIAN').attr('readonly','readonly').val('');
            $('#ManApplyEduFromDIM_GUARDIAN_PHONE').attr('readonly','readonly').val('');
        }
    });
    $('body').on( 'click', '.st_parents', function( event ) {
        if ($('#ManApplyEduFromDIM_HAS_PARENTAL_CARE').val() != 1) {
            $('#ManApplyEduFromDIM_HAS_PARENTAL_CARE').attr('style','border:3px solid; color:red;')
            setTimeout(function(){ $('#ManApplyEduFromDIM_HAS_PARENTAL_CARE').attr('style','') }, 500);
        }
    });

    $('body').on( 'click', '.st_parents_guardian', function( event ) {
        if ($('#ManApplyEduFromDIM_HAS_PARENTAL_CARE').val() !== '0') {
            $('#ManApplyEduFromDIM_HAS_PARENTAL_CARE').attr('style','border:3px solid; color:red;')
            setTimeout(function(){ $('#ManApplyEduFromDIM_HAS_PARENTAL_CARE').attr('style','') }, 500);
        }
    });

    $('body').on( 'change', 'select.eresultFilters:not(#Evaluation_eyear)', function( event ) {
        var filters = $('.eresultFilters').serialize();
        var url = $(this).parents('.filter-group').data('href');

        if( url != '' )
            window.location.href = url+'?'+filters;
    });




    $('body').on( 'change', '#ManStudPersonalPlan_SUBJECT', function( event ) {
        var _this = $(this);
        var val = _this.val();
        var selectObj = $('#ManStudPersonalPlan_SUBJ_GROUP_ID');
        var ajaxUrl = '/'+lang+'/epsgi';

        $('#eplan-form').find('input[type="text"]').val('');

        if( val != '' )
        {
            var re_dataAttr = /^data\-(.+)$/;

            $.each(_this.find('option:selected').get(0).attributes, function(index, attr) {
                if (re_dataAttr.test(attr.nodeName)) {
                    var key = attr.nodeName.match(re_dataAttr)[1];

                    $('input#ManStudPersonalPlan_'+key.toUpperCase()).val(attr.nodeValue);
                }
            });

            $.ajax({
                type: 'POST',
                data: 'id='+val,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    selectObj.find('[value!=""]').remove();
                    selectObj.attr('disabled','disabled');
                },
                success: function(data)
                {
                    if( data != 0 )
                    {
                        selectObj.html(data);
                        selectObj.removeAttr('disabled');
                    }
                }
            });
        }
        else
        {
            selectObj.find('[value!=""]').remove();
            selectObj.attr('disabled','disabled');
        }
    });

    $('body').on( 'submit', 'form#mail-login-form', function( event ) {
        $(this).ajaxSubmit({
            beforeSend: function()
            {
                $('#ManWebUsers_EMAIL').css('border-color', '#fff');
                $('#ComSubElemValue_PIN').css('border-color', '#fff');
                $('#ComSubElemValue_SC').css('border-color', '#fff');
                $('#ComSubElemValue_SN').css('border-color', '#fff');
            },
            success: function(data)
            {
                
                var obj = ( typeof(data) == 'string' ) ? $.MParseJSON(data) : data;
                
                if( obj.status == 'ok' )
                {
                    $('.main_lightbox').hide();
                    $('html').css('overflow-y', 'auto');
                }
                else
                {
                    if(obj.error == 'mailError')
                    {
                       $("#ManWebUsers_EMAIL").css('border-color', '#f00');
                       $("#ManWebUsers_EMAIL").shake(3,5,800); 
                    }
                   
                    if(obj.errorPin == 'pinError')
                    {
                        $("#ComSubElemValue_PIN").css('border-color', '#f00');
                        $("#ComSubElemValue_PIN").shake(3,5,800);
                    }
                    
                    if(obj.errorSC == 'seriaError')
                    {
                        $("#ComSubElemValue_SC").css('border-color', '#f00');
                        $("#ComSubElemValue_SC").shake(3,5,800);
                    }
                    
                    if(obj.errorSn == 'snError')
                    {
                        $("#ComSubElemValue_SN").css('border-color', '#f00');
                        $("#ComSubElemValue_SN").shake(3,5,800);
                    }
                    
                    
                }
            }
        });

        return false;
    });

    var formSubmitButtonType = 'yt0';
    $('body').on( 'click', 'input[name="yt0"]', function( event ) {
        formSubmitButtonType = 'yt0';
    });
    $('body').on( 'click', 'input[name="yt1"]', function( event ) {
        formSubmitButtonType = 'yt1';
    });
    $('body').on( 'click', 'input[name="fileChange"]', function( event ) {
        formSubmitButtonType = 'fileChange';
    });

    $('body').on( 'submit', 'form#apply-formUpdate', function( event ) {
        var dataID = $(this).data('id');
        $(this).ajaxSubmit({
            beforeSubmit : function(arr, $form, options)
            {
                let enabled_docs = window.row_data ? window.row_data.ENABLED_DOCS : '';
                let delete_docs = window.row_data ? window.row_data.DELETE_DOCS : '';
                let profession = $('#ManApplyEduFromDerbend_DIC_EDU_SPECIALTY') ? $('#ManApplyEduFromDerbend_DIC_EDU_SPECIALTY').find(":selected").text() : '';
                let fileTitleArr = document.getElementById('fileTitleArr') ? document.getElementById('fileTitleArr').fileTitleArr: '';
                arr.push({name: 'submit', value: formSubmitButtonType}, {name: 'dataID', value: dataID},{name:'enabled_docs',value: enabled_docs},{name:'delete_docs',value: delete_docs},{name:'profession', value: profession},{name:'fileTitleArr', value: JSON.stringify(fileTitleArr)});
            },
            beforeSend: function()
            {
                $('.errorMessage').html('');
            },
            success: function(data)
            {
                var obj = ( typeof(data) == 'string' ) ? $.MParseJSON(data) : data;
                if(typeof(obj.errors) != "undefined" && obj.errors !== null)
                {
                    for (var e in obj.errors)
                    {
                        $('[data-for='+e+']').html(obj.errors[e]);
                    }

                    var o = $( ".errorMessage" ).not(':empty').first();

                    if( o.length > 0 )
                    {
                        var p = o.offset();
                        $('#applyPopupForDerbend').animate({
                            scrollTop: p.top + 400
                        }, 1000);
                        o.parent().parent().find('input').first().focus();
                    }
                }
                else
                {
                    if( typeof(obj.status) != "undefined" && obj.status !== null && obj.status == 0 )
                    {
                        $('#modal2').modal('hide');
                        location.reload();
                    }
                }
            }
        });
        return false;
    });

     $('body').on( 'submit', 'form#apply-form', function( event ) {

        var val = ($("input[name='yt0']").hasClass("Clicked")) ? 'yt0' : 'yt1';
        var dataID = $(this).data('id');

        $(this).ajaxSubmit({
            beforeSubmit : function(arr, $form, options)
            {
              arr.push({name: 'submit', value: formSubmitButtonType}, {name: 'newRecord', value: dataID});
            },
            beforeSend: function()
            {

                $('.errorMessage').html('');
            },
            success: function(data)
            {
                if (data == 0) {
                    $('#repeatedApply').modal('show');
                    return;
                }
                var obj = ( typeof(data) == 'string' ) ? $.MParseJSON(data) : data;
                if(typeof(obj.errors) != "undefined" && obj.errors !== null)
                {
                    $('.form-group').attr('style','min-height:100px');
                    for (var e in obj.errors)
                    {
                        $('[data-for='+e+']').html(obj.errors[e]);
                    }

                    var o = $( ".errorMessage" ).not(':empty').first();

                    if( o.length > 0 )
                    {
                      var p = o.offset();

                      $('#applyPopupForDIM').animate({
                        scrollTop: p.top + 1800
                      }, 1000);

                      o.parent().parent().find('input').first().focus();
                    }
                }
                else
                {
                    if( typeof(obj.status) != "undefined" && obj.status !== null && obj.status == 0 )
                    {
                        $('#modal2').modal('hide');
                        location.reload();
                    }
                }
            }
        });
        return false;
    });

    $('body').on( 'click', '#pulesok', function( event ){
        if (!$('#pulesok').attr('readed')) {
            $('#pulesok').prop('checked', false);
            $('#agreementRead').modal('show')
        }
    });
    $('body').on( 'click', '#agreementpdf', function( event ){
        event.target.href = $('#agreementpdf').attr('url')  + '?payment_way='+$('#ManApplyEduFromDIM_DIC_PAYMENT_WAY_ID').val();
        $('#pulesok').attr('readed', 'true');
    });

     /*Distant exam*/
    $("body").on( "click", "#examFiles-grid tr", function( event ) {
        $(this).siblings().removeClass("selected_tr");
        $(this).addClass("selected_tr");
    });
    
    
    $('body').on( 'submit', '#evaluation-form', function( event ) {
        var data = $(this).customSerializeAsString();
        var ajaxUrl = $(this).attr('action');

        $.ajax({
            type: 'POST',
            data: data,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                $('.errorMessage').html('');
            },
            success: function(data)
            {
                var obj = ( typeof(data) == 'string' ) ? $.MParseJSON(data) : data;
                if(typeof(obj.errors) != "undefined" && obj.errors !== null)
                {
                    for (var e in obj.errors)
                    {
                        if( e == 'changedRow' )
                        {
                            for (var c in obj.errors[e])
                            {
                                $('[data-for='+e+']').append(obj.errors[e][c]+'<br/>');
                            }
                        }
                        else
                            $('[data-for='+e+']').html(obj.errors[e]);
                    }

                    var o = $( ".errorMessage" ).not(':empty').first();

                    if( o.length > 0 )
                    {
                      var p = o.offset();

                      $('html, body').animate({
                        scrollTop: p.top - 70
                      }, 1000);

                      o.parent().parent().find('input').first().focus();
                    }
                }
                else
                {
                    if( typeof(obj.status) != "undefined" && obj.status !== null && obj.status == 0 )
                    {
                        $('#modalFileForm').modal('hide');
                        location.reload();
                    }
                }
            }
        });
        return false;
    });
    
    
    $('body').on( 'click', '#examFilePopup', function( event ) { 
        $(".load-apply2").show(); 
        var getTrId = $("#examFiles-grid tr.selected_tr");
        var id = getTrId.children("td:nth-child(2)").html();
        var ajaxUrl = '/'+lang+'/newExamFilePopup';
        if(id)
        {
            $.ajax({
                type: 'POST',
                data: 'id='+id,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    $('#applyPopup').html('');
                },
                success: function(data)
                {
                    $(".load-apply2").hide();
                    $('#applyPopup').append(data);
                    $('#newExamFilePopup').modal('show');
                }
            }); 
        }else{
            $(".load-apply2").hide();
            alert("Her hansi setir secin");
        } 
    });

     $('body').on( 'change', '#ManApplyEduFromDerbend_DIC_EDU_TYPE_ID', function( event ) {
         var id = event.target.value;
         var ajaxUrl = '/' + lang + '/getDerbendPfrofessions';
         var obj = $('#ManApplyEduFromDerbend_DIC_EDU_SPECIALTY');
         if (id) {
             $.ajax({
                 type: 'POST',
                 data: 'id=' + id,
                 url: ajaxUrl,
                 cache: false,
                 processData: false,
                 beforeSend: function () {
                     $(".load-apply2").show();
                 },
                 success: function (data) {
                     $(".load-apply2").hide();
                     if( data != 0 )
                     {
                         obj.removeAttr('disabled');
                         obj.html(data);
                     }
                     else
                     {
                         obj.find('[value!=""]').remove();
                         obj.attr('disabled','disabled');
                     }
                 }
             });
         }
     });

    $('body').on( 'change', '#ManApplyEduFromDerbend_DIC_EDU_SPECIALTY', function( event ) {
        var id = event.target.value;
        var ajaxUrl = '/' + lang + '/getDerbendPfrofPrice';
        var obj = $('#ManApplyEduFromDerbend_PAYMENT_SUM');
        if (id) {
            $.ajax({
                type: 'POST',
                data: 'id=' + id,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function () {
                    $(".load-apply2").show();
                },
                success: function (data) {
                    $(".load-apply2").hide();
                    if( data != 0 )
                    {
                        obj.val(data);
                    }else{
                        obj.val('');
                    }
                }
            });
        }
    });
   
    
    $(".navbar ul li a").click(function () {
           menu=$(this).attr('id');
        $(this).parents('.navbar').find('a').removeClass('selected_link');
        $(this).addClass('selected_link');
    
         switch (menu){
             case 'azerCitizenship_registr':
                 $('.foregin_citizenship').hide();
                   $('.derbend_citizenship').hide();
                 $('.azer_citizenship').show();
                 break;
             case 'foreginCitizenship_registr':
                 $('.azer_citizenship').hide();
                 $('.foregin_citizenship').show();
                   $('.derbend_citizenship').hide();
                 break;
                 
            case 'derbend_registr':
                 $('.azer_citizenship').hide();
                 $('.foregin_citizenship').hide();
                 $('.derbend_citizenship').show();
                 break;
         }
    
    });
    
    
    $('body').on( 'click', '#applyForDIM', function( event ) {
        if (window.row_data) {
            var ID = $('#applyFromDIM-grid')[0].children[0].children[1].children[0].children[1].innerText;
            var data='ID='+ ID +'&row_data='+JSON.stringify(window.row_data);
            var ajaxUrl = '/'+lang+'/openApplyFromGrid';
            $.ajax({
                type: 'POST',
                data:data,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    $('#applyPopup').html('');
                },
                success: function(data)
                {
                    $(".load-apply2").hide();
                    $('#applyPopup').append(data);
                    $('#applyPopupForDIM').modal('show');
                }
            });
            return false;
        } else {
            $(".load-apply2").show();
            var ajaxUrl = '/'+lang+'/openApplyPopupForDIM';
            $.ajax({
                type: 'POST',
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    $(".load-apply2").show();
                    $('#applyPopup').html('');
                },
                success: function(data)
                {
                    $(".load-apply2").hide();
                    $('#applyPopup').append(data);
                    $('#applyPopupForDIM').modal('show');
                    if ($('#ManApplyEduFromDIM_DIC_EDU_PAYMENT_TYPE').val() == '20001108'){
                        $('#ManApplyEduFromDIM_FILE_5')[0].disabled =true;
                        for (var i = 1; i < 24; i++) {
                            $('#ManApplyEduFromDIM_FREE_FILE_'+i)[0].disabled = true;
                        }
                    }
                }
            });
        }
    });

    $("body").on( "click", "#agreementDerbend", function( event ) {
        $('#pulesok').attr('readed', 'true');
        var ajaxUrl = $(this).attr('url');
        var level = $('#ManApplyEduFromDerbend_DIC_EDU_LEVEL').find(":selected").text();
        var date = '';
        var full_name = $('#ManApplyEduFromDerbend_SURNAME').val()+' '+$('#ManApplyEduFromDerbend_NAME').val()+' '+$('#ManApplyEduFromDerbend_MIDDLE_NAME').val();
        var profession = $('#ManApplyEduFromDerbend_DIC_EDU_SPECIALTY').find(":selected").text();
        var payment_sum = $('#ManApplyEduFromDerbend_PAYMENT_SUM').val();
        var address = $('#ManApplyEduFromDerbend_REG_ADDRESS').val();
        var sv_seria = $('#ManApplyEduFromDerbend_ID_SERIA').val() +' '+$('#ManApplyEduFromDerbend_ID_NUMBER').val();
        var mobile = $('#ManApplyEduFromDerbend_CONTACT_VALUE_HANDY').val();
        ajaxUrl += '?level='+level+'&date='+date+'&full_name='+full_name+'&profession='+profession+'&payment_sum='+payment_sum+'&address='+address+'&sv_seria='+sv_seria+'&mobile='+mobile;
        if ($('#ManApplyEduFromDerbend_DIC_EDU_LEVEL').val() && $('#ManApplyEduFromDerbend_DIC_EDU_SPECIALTY').val() && address && sv_seria && mobile){
            window.open(ajaxUrl,'_blank');
        } else {
            alert('məlumatları doldurun');
        }
    });

    $('body').on( 'click', '#applyForDerbend', function( event ) { 
        $(".load-apply2").show();   
        var ajaxUrl = '/'+lang+'/openApplyPopupForDerbend';
        $.ajax({
            type: 'POST', 
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                $(".load-apply2").show();
                $('#applyPopup').html('');
            },
            success: function(data)
            {
                $(".load-apply2").hide();
                $('#applyPopup').append(data);
                $('#applyPopupForDerbend').modal('show');
            }
        }); 
    });

    $('body').on( 'click', '#deleteFreeFile', function( event ) {
        var ajaxUrl = '/'+lang+'/deleteFreeFile';
        var ID = $('#deleteFreeFileConfirm').attr('applyid');
        var fileid = $('#deleteFreeFileConfirm').attr('fileid');
        var data='ID='+ ID +'&fileid='+fileid;
        if ( ID && fileid) {
            $.ajax({
                type: 'POST',
                data:data,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function(){},
                success: function(data){
                    $('.deleteFreeFile'+fileid).hide();
                    $('#ManApplyEduFromDIM_FREE_FILE_'+fileid)[0].disabled = 'disabled';
                    $('#ManApplyEduFromDIM_FREE_FILE_'+fileid).parent().parent()[0].style='';
                    $('#ManApplyEduFromDIM_FREE_FILE_'+fileid).parent().parent().children()[3].innerHTML='';

                }
            });
        }
    });

    $("body").on( "dblclick", "#applyFromDIM-grid> .table > tbody > tr > td", function( event ) {
        var ID = $(this).parent().children("td:nth-child(2)").html().trim();
        var data='ID='+ ID +'&row_data='+JSON.stringify(window.row_data);
        var ajaxUrl = '/'+lang+'/openApplyFromGrid';
        $.ajax({
            type: 'POST',
            data:data,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                $('#applyPopup').html('');
            },
            success: function(data)
            {
                $(".load-apply2").hide();
                $('#applyPopup').append(data);
                $('#applyPopupForDIM').modal('show');
            }
        });
        return false;
    });

    $("body").on( "dblclick", "#applyFromDerbend-grid> .table > tbody > tr > td", function( event ) {
        var ID = $(this).parent().children("td:nth-child(2)").html().trim();
        var data='ID='+ ID +'&row_data='+JSON.stringify(window.row_data);
        var ajaxUrl = '/'+lang+'/openApplyFromDerbendGrid';
        $.ajax({
            type: 'POST',
            data:data,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                $('#applyPopup').html('');
            },
            success: function(data)
            {
                $(".load-apply2").hide();
                $('#applyPopup').append(data);
                $('#applyPopupForDerbend').modal('show');
            }
        });
        return false;
    });
    $("body").on( "click", ".dayzoomlink", function( event ) {
        var p_link_id = event.target.attributes.p_link_id.value;
        var data='p_link_id='+ p_link_id;
        var ajaxUrl = '/'+lang+'/zoomlinkclick';
        $.ajax({
            type: 'POST',
            data:data,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {

            },
            success: function(data)
            {

            }
        });
    });

    $('body').on( 'submit', 'form#eplan-form,  form#files-form', function( event ) {

        var modalId = ( $(this).attr('id') == 'eplan-form' ) ? 'modalPlanCreate' : 'modalFileForm';


        $(this).ajaxSubmit({
            beforeSend: function()
            {
                $('.errorMessage').html('');
            },
            success: function(data)
            {
                var obj = ( typeof(data) == 'string' ) ? $.MParseJSON(data) : data;
                if(typeof(obj.errors) != "undefined" && obj.errors !== null)
                {
                    for (var e in obj.errors)
                    {
                        if( e == 'changedRow' )
                        {
                            for (var c in obj.errors[e])
                            {
                                $('[data-for='+e+']').append(obj.errors[e][c]+'<br/>');
                            }
                        }
                        else
                            $('[data-for='+e+']').html(obj.errors[e]);
                    }

                    var o = $( ".errorMessage" ).not(':empty').first();

                    if( o.length > 0 )
                    {
                      var p = o.offset();

                      $('html, body').animate({
                        scrollTop: p.top - 70
                      }, 1000);

                      o.parent().parent().find('input').first().focus();
                    }
                }
                else
                {
                    if( typeof(obj.status) != "undefined" && obj.status !== null && obj.status == 0 )
                    {
                        $('#'+modalId).modal('hide');
                        location.reload();
                    }
                }
            }
        });

        return false;
    });

    $('body').on( 'change', '.FREE_FILE_', function( event ) {
        $('#ManApplyEduFromDIM_DIC_PAYMENT_WAY_ID').val(2100)[0].style.pointerEvents = 'none';
        return false;
    });

    $("#zoom_chat_send_msg").on( "click", function( event ) {
        var message = event.target.parentElement.children[0].value;
        var url = new URL(window.location.href);
        var channel_id = url.searchParams.get('channel_id');
        var ajaxUrl = '/'+lang+'/zoomSendChatMessage';
        if (channel_id) {
            $.ajax({
                type: 'POST',
                data: 'channel='+channel_id+'&message='+message,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    event.target.parentElement.children[0].value = "";
                },
                success: function(data)
                {
                    ajaxUrl = '/'+lang+'/zoomGetChatGetMessages';
                    $.ajax({
                        type: 'POST',
                        data: 'id='+channel_id,
                        url: ajaxUrl,
                        cache: false,
                        processData: false,
                        beforeSend: function()
                        {

                        },
                        success: function(data)
                        {
                            $('.msg_history').html(data).animate({  scrollTop: 30000000000 }, 1000);
                        }
                    });
                }
            });
        }
    });

    $("#add_zoom_channel_member_popup").on( "click", function( event ) {
        var ajaxUrl = '/'+lang+'/addMemberPopup';
        var url = new URL(window.location.href);
        var id = url.searchParams.get('id');
        var chat_name = url.searchParams.get('name');
        $.ajax({
            type: 'POST',
            data: 'id='+id+'&chat_name='+chat_name,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                $('#applyPopup').html('');
            },
            success: function(data)
            {
                $('#applyPopup').html(data);
                $('#invite_to_channel_popup').modal('show');
            }
        });
    });

    $(".delete_chat_channel").on( "click", function( event ) {
        var id = event.target.getAttribute('channel_id');
        var ajaxUrl = '/'+lang+'/zoomDeleteChatChannel';
        if (id) {
            $.ajax({
                type: 'POST',
                data: 'channel='+id,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                },
                success: function(data)
                {
                    location.reload();
                }
            });
        }
    });


    $("#update_zoom_channel").on( "click", function( event ) {
        var id = $('#update_channel').attr('channel_id');
        var channel_name = $('#zoom_channel_new_name').val();
        var ajaxUrl = '/'+lang+'/zoomUpdateChatChannel';
        if (id) {
            $.ajax({
                type: 'POST',
                data: 'channel='+id+'&channel_name='+channel_name,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                },
                success: function(data)
                {
                    location.reload();
                }
            });
        }
    });

    $(".create_cahhel_btn").on( "click", function( event ) {
        var ajaxUrl = '/'+lang+'/zoomCreateChatChannel';
        var subjgrup_id = event.target.parentElement.parentElement.children[1].innerText;
        var channel_name = event.target.parentElement.parentElement.children[3].innerText
        if (channel_name) {
            $.ajax({
                type: 'POST',
                data: 'channel_name='+channel_name+'&subjgrup_id='+subjgrup_id,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                },
                success: function(data)
                {
                    if (data) {
                        alert(data);
                        location.reload();
                    } else {
                        location.reload();
                    }
                }
            });
        }
        return;
    });

    $("#zoom_chat_menu").on( "click", function( event ) {
        var ajaxUrl = '/'+lang+'/zoomChatMenu';
        $.ajax({
            type: 'POST',
            data: '',
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
            },
            success: function(data)
            {
                if (data == 'oauthAuthorize'){
                    window.location.href = '/'+lang+'/oauthAuthorize';
                    return;
                }
                $('#zoom_chat_menu_list')[0].innerHTML = data;
            }
        });
    });

    $("#zoom_chat_start_meeting").on( "click", function( event ) {
        var ajaxUrl = '/'+lang+'/zoomChatStartMeeting';
        var url = new URL(window.location.href);
        var channel_id = url.searchParams.get('channel_id');
        $.ajax({
            type: 'POST',
            data: 'channel_id=' + channel_id,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
            },
            success: function(url)
            {
                if (url) {
                    window.open(url, '_blank');
                } else {
                    alert('Müəllim video görüşü başlamadı')
                }
            }
        });
    });


    $('body').on( 'click', '#discussion_panel-grid > .table > tbody > tr > td', function( event ) {
        if (event.target.innerText == "Kanalı yarat") {
            return;
        }
        var ID = $(this).parent().children("td:nth-child(2)").html().trim();
        var channel_id = $(this).parent().children("td:nth-child(3)").html().trim();
        var name = $(this).parent().children("td:nth-child(4)").html().trim();
        if (channel_id) {
            window.location.href = '/'+lang+'/zoomChat?id='+ID+'&channel_id='+channel_id+'&name='+name;
        } else {
            alert('Bu fənn üçün kanal yaradılmamışdır');
        }
    });

    $('body').on( 'change', '#subjectForContact', function( event ) {


        var id = $( this ).val();
        var data_subj = $(this).find(':selected').attr('data-subject');
        var ajaxUrl = '/'+lang+'/getTeahersBySubject';
        var selectObj = $("#teacherForContact");

        $.ajax({
            type: 'POST',
            data:'id='+id+'&data-subject='+data_subj,
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {

            },
            success: function(data)
            {

                selectObj.html(data);

            }
        });


        return false;
    });

    $('body').on( 'click', '#newContactToTeacher', function( event ) {


        var id = $("#teacherForContact").val();
        var subjGrId = $("#subjectForContact").val();

        var ajaxUrl = '/'+lang+'/teacherForContact';
        if(subjGrId)
        {
            $.ajax({
                type: 'POST',
                data: 'id='+id+'&subjGrId='+subjGrId,
                url: ajaxUrl,
                cache: false,
                processData: false,
                beforeSend: function()
                {
                    $('#applyPopup').html('');
                },
                success: function(data)
                {
                    $('#applyPopup').html(data);
                    $('#newModalContactTeacher').modal('show');
                }
            });
        }
        else
        {
            var text = getMessage(lang,'emptySubjMessage');
            alert(text);
        }

    });

    $('body').on( 'click', '#createContactChat', function( event ) {

        var subjGrId = $(this).data('subjid');
        var teacid = $(this).data('teacid');
        var title = $("#chatGroupContactTitle").val();
        var text = $("#chatGroupContactText").val();

        var ajaxUrl = '/'+lang+'/createNewContactChat';
        var data = 'subjGrId='+subjGrId+'&title='+title+'&text='+text+'&teacid='+teacid;
        $.ajax({
            type: 'POST',
            url: ajaxUrl,
            data:data,
            cache: false,
            processData: false,
            beforeSend: function()
            {

            },
            success: function(data)
            {
                var obj=jQuery.MParseJSON(data);
                if(obj.status=='ok')
                {
                    window.location.reload();
                }
                else
                {
                    $('#applyPopup').append(obj.error);
                    $('#modalApplySecondError').modal('show');
                }

            }
        });
        return false;
    });

    $.extend({
        MParseJSON: function (string) {

            return eval('('+string+')');

        },
        password: function (length) {

            var password = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-+=_!@$#*%<>{}[]";

            for( var i=0; i < length; i++ )
                password += possible.charAt(Math.floor(Math.random() * possible.length));

            return password;

        },
        ucWord: function (str) {
            str = str.toLowerCase().replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, function(replace_latter) {
                return replace_latter.toUpperCase();
            });
            return str;
        }
    });
    setTimeout( function(){ $("#foreginCitizenship_registr").click()}, 2000)
    
});

    jQuery.fn.customSerializeAsString = function() {
        var obj = '';
        var findElements = $(this).find('input, select, textarea');
        var indexForCount = 1;

        findElements.each(function(i, input) {
            var attrTagName = $(this)[0].tagName.toLowerCase();

            obj += $(this).attr('name')+'='+$(this).val();
            if( indexForCount != findElements.length )
                obj += '&';

            if( attrTagName == 'select' )
            {
                var data = $(this).find('option:selected').getDataAttributes();

                if( !jQuery.isEmptyObject(data) )
                {
                  $.each(data , function(index, value){
                       obj += index+'='+value+'&';
                  });
                }
            }
            else
            {
                var data = $(this).getDataAttributes();

                if( !jQuery.isEmptyObject(data))
                {
                  $.each(data , function(index, value){
                       obj += index+'='+value+'&';
                  });
                }
            }

            indexForCount ++;
        });

        //console.log(obj);

        return obj;
    }

    jQuery.fn.getDataAttributes = function()
    {
        var d = {},
            re_dataAttr = /^data-post\-(.+)$/;

        if(typeof ($(this).get(0)) != 'undefined' )
        {
            $.each($(this).get(0).attributes, function(index, attr) {
                if (re_dataAttr.test(attr.nodeName)) {
                    var key = attr.nodeName.match(re_dataAttr)[1];
                    d[$.ucWord(key)] = attr.nodeValue;
                }
            });

        }

        return d;
    }

    jQuery.fn.shake = function(intShakes, intDistance, intDuration)
    {
        this.each(function()
        {
            $(this).css("position","relative");
            for (var x=1; x<=intShakes; x++)
            {
                $(this).animate({left:(intDistance*-1)}, (((intDuration/intShakes)/4)))
                .animate({left:intDistance}, ((intDuration/intShakes)/2))
                .animate({left:0}, (((intDuration/intShakes)/4)));
            }
        });
    return this;
    };

    var notificationPopup = function (did, type)
    {
        var ajaxUrl = '/'+lang+'/notification';

        $.ajax({
            type: 'POST',
            data: 'id='+did+'&t='+type+'&open=',
            url: ajaxUrl,
            cache: false,
            processData: false,
            beforeSend: function()
            {
                $('#applyPopup').html('');
            },
            success: function(data)
            {
                $('#applyPopup').html(data);
                $('#modal6').modal('show');
            }
        });
    }

    var getName = function (str)
    {
        if (str.lastIndexOf('\\'))
        {
            var i = str.lastIndexOf('\\')+1;
        }
        else
        {
            var i = str.lastIndexOf('/')+1;
        }
        var filename = str.slice(i);
        var uploaded = document.getElementById("fileformlabel");
        uploaded.innerHTML = filename;
    }
$(document).bind("ajaxSend", function(){
    if ((window.location.href).includes('applyFromDIM')||(window.location.href).includes('applyFromDerbend')){
        $(".load-apply2").show();
    }
}).bind("ajaxComplete", function(){
    if ((window.location.href).includes('applyFromDIM')||(window.location.href).includes('applyFromDerbend')){
        $(".load-apply2").hide();
        //open accordion if has returned free file docs
        for (i = 1; i < 23; i++) {
            $('.deleteFreeFile'+i).parent().parent().parent().parent().parent().parent().attr('style','').attr('class','panel-colapse collapse in');
        }
        //open accordion if free file has error massage
        for (i = 0; i < $('.freeFileError').not(':empty').length; i++) {
            $('.freeFileError').not(':empty')[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style='';
            $('.freeFileError').not(':empty')[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.className='panel-colapse collapse in';
        }

    }
});
function confirmMailPopup () {
    var ajaxUrl = '/'+lang+'/mailConfirmationPopup';
    $.ajax({
        type: 'POST',
        data: '',
        url: ajaxUrl,
        cache: false,
        processData: false,
        beforeSend: function()
        {
            $('#applyPopup').html('');
        },
        success: function(data)
        {
            $('#applyPopup').html(data);
            $('#mail_confirmation_modal').modal({backdrop: false, keyboard: false});
        }
    });
}
function openZoomChat (e) {
    var channel_id = e.target.getAttribute('channel_id');
    var name = e.target.innerHTML;
    window.location.href = '/'+lang+'/zoomChat?channel_id='+channel_id+'&name='+name;

}

function add_zoom_channel_popup ( event ) {
    var ajaxUrl = '/'+lang+'/newChannelPopup';
    $.ajax({
        type: 'POST',
        data: '',
        url: ajaxUrl,
        cache: false,
        processData: false,
        beforeSend: function()
        {
            $('#applyPopup').html('');
        },
        success: function(data)
        {
            $('#applyPopup').html(data);
            $('#add_zoom_channel').modal('show');
        }
    });
}



