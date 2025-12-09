$(document).ready(function() {
    // Handle Nav Link Clicks
    $('.nav-link').on('click', function(e) {
        e.preventDefault(); // Prevent default link behavior

        // Get the platform name from the clicked link
        const platform = $(this).text();

        // Update the hero title
        $('.hero h1').text(platform);

        // Remove 'active' class from all nav-links
        $('.nav-link').removeClass('active');
        // Add 'active' class to the clicked link
        $(this).addClass('active');
    });
});

$.getScript("theme/allloadx/js/suggeser.js",
    function () {
        $("#txt-url").bsSuggest({
            indexId: 0,             //data.value 的第几个数据，作为input输入框的内容
            indexKey: 0,            //data.value 的第几个数据，作为input输入框的内容
            allowNoKeyword: false,  //是否允许无关键字时请求数据。为 false 则无输入时不执行过滤请求
            multiWord: true,        //以分隔符号分割的多关键字支持
            separator: ",",         //多关键字支持时的分隔符，默认为空格
            getDataMethod: "url",   //获取数据的方式，总是从 URL 获取
            showHeader: false,       //显示多个字段的表头
            autoDropup: false,       //自动判断菜单向上展开
            searchingTip: 'Searching...',       // ajax 搜索时显示的提示内容，当搜索时间较长时给出正在搜索的提示
            delay: 50,
            url: 'https://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&q=', /*优先从url ajax 请求 json 帮助数据，注意最后一个参数为关键字请求参数*/
            jsonp: 'jsonp',               //如果从 url 获取数据，并且需要跨域，则该参数必须设置
            // url 获取数据时，对数据的处理，作为 fnGetData 的回调函数
            fnProcessData: function (json) {
                var index, len, data = {value: []};

                if (!json || !json.length) {
                    return false;
                }

                len = json[1].length;

                for (index = 0; index < len; index++) {
                    data.value.push({
                        "Keyword": json[1][index][0]
                    });
                }

                return data;
            },

        }).on('onDataRequestSuccess', function (e, result) {
            // console.log('onDataRequestSuccess: ', result);
        }).on('onSetSelectValue', function (e, keyword, data) {
            // console.log('onSetSelectValue: ', e, keyword, data);
        }).on('onUnsetSelectValue', function () {
            // console.log("onUnsetSelectValue");
        });
    });

    $('#btn-submit').on('click', function() {
        const videoUrl = $('#txt-url').val();
        if (!videoUrl) {
            alert('Please paste a video link first.');
            return;
        }

        const apiUrl = `/download?url=${encodeURIComponent(videoUrl)}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log('API Response:', data);

                // Populate the download results
                $('#video-thumbnail').attr('src', data.meta.thumbnail);
                $('#video-title').text(data.meta.title);

                const downloadLinks = $('#download-links');
                downloadLinks.empty(); // Clear previous links

                data.url.forEach(item => {
                    const quality = item.quality || 'Unknown Quality';
                    const link = `<a href="${item.url}" target="_blank" class="list-group-item list-group-item-action">${quality}</a>`;
                    downloadLinks.append(link);
                });

                $('#download-results').show();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert('An error occurred while fetching video data. Please check the console for details.');
            });
    });