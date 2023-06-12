require('strict')

local p = {}

local data = mw.loadData("Module:明日方舟敌方/data")

local rank = data.rank

local function generate(d)
	local _rank = {}
	for k, v in pairs(rank) do
		for i, j in pairs(v) do
			if j[1] <= d[i] and d[i] < j[2] then
				_rank[i] = k
			end
		end
	end
	return '<div id="ake-' .. d.name .. '" class="ake ake' .. d.class .. '"><div class="akeHead mw-customtoggle-ake-' ..
		d.index .. '"><p class="akeType">' .. d.type .. '</p><p class="akeLifePoint">' ..
		(d.lifePoint and '扣除关卡生命值：' .. d.lifePoint or '') .. '</p><p class="akeIndex">' ..
		(d.index == 'null' and '-' or d.index) .. '</p><p class="akeName">' .. d.name ..
		'</p><p class="akeTags">' .. table.concat(d.tags, " ") ..
		'</p></div><div class="akeBody"><div class="akeBodyLeft mw-customtoggle-ake-' .. d.index ..
		'">[[File:明日方舟 ' .. (d.name == "暂无资料" and '调查中' or 'tx 敌人 ' .. d.name) ..
		'.png|90x90px|link=|' .. d.name .. ']]<p>重量<span>' .. d.weight ..
		'</span></p></div><div class="akeBodyRight mw-customtoggle-ake-' .. d.index .. '"><p>生命值<span>' ..
		_rank.hp .. '</span></p><p>移动速度<span>' .. _rank.spd .. '</span></p><p>攻击力<span>' ..
		_rank.atk .. '</span></p><p>攻击速度<span>' .. _rank.aspd .. '</span></p><p>防御力<span>' ..
		_rank.def .. '</span></p><p>法术抗性<span>' .. _rank.res ..
		'</span></p></div><p class="akeText mw-customtoggle-ake-' .. d.index .. '">' ..
		(d.info == '暂无资料' and '' or d.info) .. '</p>' .. ((d.ability or d.resistance or d.relEnemy) and
			'<div class="akeBodyBottom mw-collapsible mw-collapsed" id="mw-customcollapsible-ake-' .. d.index .. '">' ..
			(d.ability and '<div class="akeAbility mw-customtoggle-ake-' .. d.index ..
				'"><p class="akeTitle">能力</p><p class="akeText"><ul><li>' .. table.concat(d.ability, "</li><li>") ..
				'</li></ul></p></div>' or '') ..
			(d.resistance and '<div class="akeResistance mw-customtoggle-ake-' .. d.index ..
				'"><p class="akeTitle">抗性</p><p class="akeText"><span>' ..
				table.concat(d.resistance, "</span><span>") .. '</span></p></div>' or '') ..
			table.concat((d.relEnemy and (function()
				local replEnemy = {}
				for i, v in ipairs(d.relEnemy) do
					replEnemy[i] =
						'<div class="akeRelEnemy"><div class="akeRelEnemyImgBox" style="-webkit-mask-image:-webkit-linear-gradient(left,#000 90px,transparent)">[[File:明日方舟 tx 敌人 ' ..
						v .. '.png|90x90px|link=|' .. v ..
						']]</div><div class="akeRelEnemyText"><div class="akeTitle">关联敌人</div><div class="akeText">' ..
						v .. '</div></div>[[明日方舟/敌人#ake-' .. v ..
						'|<span class="akeRelEnemyLinkCover"></span>]]</div>'
				end
				return replEnemy
			end)() or {})) .. '</div>' or '') .. '</div></div>'
end

function p.main(frame)
	return generate(data.enemy[mw.ustring.upper(frame.args["编号"] or frame.args[1] or '')] or data.null)
end

function p.filter(frame)
	if frame.args[1] and frame.args[2] then
		local output = ''
		for _, k in ipairs(data.index) do
			local d = data.enemy[k]
			if type(d[frame.args[1]]) == "table" then
				for _, v in ipairs(d[frame.args[1]]) do
					if v == frame.args[2] then
						output = output .. generate(d)
						break
					end
				end
			else
				if tostring(d[frame.args[1]]) == frame.args[2] then
					output = output .. generate(d)
				end
			end
		end
		return output
	else
		local output = ''
		for _, k in ipairs(data.index) do
			output = output .. generate(data.enemy[k])
		end
		return output
	end
end

function p.customize(frame)
	local d = frame.args
	d.tags = mw.text.split(d.tags, ",", true);
	return generate(d);
end

return p
