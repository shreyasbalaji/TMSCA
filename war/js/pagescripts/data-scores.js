/* Component of GAE Project for TMSCA Contest Automation
 * Copyright (C) 2013 Sushain Cherivirala
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see [http://www.gnu.org/licenses/].
 */

$(document).ready(function () {
	ChangeActive();
	$('#printButton').on('click', function() {
		window.print();
	});

	$('#qualButton').on('click', function() {
		if($(this).text().indexOf('Mute') === -1) {
			$('.qual').addClass('text-success');
			$(this).text('Mute Qualifying');
		}
		else {
			$('.qual').removeClass('text-success');
			$(this).text('Show Qualifying');
		}
	});

	$('table#statusTable td.success, table#statusTable td.warning').on('click', function() {
		if($(this).hasClass('success'))
			$(this).removeClass('success').addClass('warning').find('i').removeClass('glyphicon-check').addClass('glyphicon-remove');
		else
			$(this).removeClass('warning').addClass('success').find('i').removeClass('glyphicon-remove').addClass('glyphicon-check');
		$('button#updateAvailability').fadeIn();
	});

	$('button#updateAvailability').on('click', function() {
		var testsGraded = [];
		$.each($('table#statusTable td.success'), function() {
			testsGraded.push($(this).data('test'));
		});

		$.ajax({
			'url': '/data/scores',
			'type': 'post',
			'data': {
				'testsGraded': JSON.stringify(testsGraded)
			}
		}).success(function() {
			location.reload();
		});
	});

	$.each($('table:not(#statusTable)'), function() {
		$.extend($.tablesorter.themes.bootstrap, {
			table: 'table'
		});

		if($('tr', this).length > 1)
			$(this).tablesorter({
				theme : 'bootstrap',
				headerTemplate : '{content} {icon}',
				widgets : ['uitheme'],
				sortList: [[0,0]]
			});
	});

	$('td').hover(function() {
		var t = parseInt($(this).index()) + 1;
		$('td:nth-child(' + t + ')', $(this).closest('table')).addClass('highlighted');
	}, function() {
		var t = parseInt($(this).index()) + 1;
		$('td:nth-child(' + t + ')', $(this).closest('table')).removeClass('highlighted');
	});
});

function ChangeActive() {
	var type = $('meta[name="type"]').prop('content');
	$('li[data-type="' + type + '"]').closest('.dropdown').addClass('active');
	$('li[data-type="' + type + '"]').addClass('active');

	if(type.indexOf("school_") !== -1) {
		var hash = hashCode(type.substring(type.indexOf('school_') + 7));
		$("#" + hash).closest('.dropdown').addClass('active');
		$('#' + hash).addClass('active');
	}
}

hashCode = function(s) {
	var hash = 0, i, c;
	if (s.length == 0) return hash;
	for (i = 0; i < s.length; i++) {
		c = s.charCodeAt(i);
		hash = ((hash << 5) - hash) + c;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};
