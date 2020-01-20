function analysis(url, channelId, itemId, title, editorId, terminal, type) {
    $.post(url, {
        channel_id: channelId,
        item_id: itemId,
        title: title,
        editor_id: editorId,
        terminal: terminal,
        type: type
    });
}
var analysisurl = "http://c.cztvcloud.com/visit";
var channelId = $("#analysis_channelId").html();
var itemId = $("#analysis_itemId").html();
var title = $("#analysis_title").html();
var editorId = $("#analysis_editorId").html();
var type = $("#analysis_type").html();
analysis(analysisurl, channelId, itemId, title, editorId, 1, type);