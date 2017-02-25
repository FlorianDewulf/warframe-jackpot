require 'open-uri'

if ARGV[0] != 'Primary' && ARGV[0] != 'Secondary' && ARGV[0] != 'Melee' && ARGV[0] != 'Warframes'
    puts 'Invalid parameters'
    return
end

source = open('http://warframe-builder.com/' + ARGV[0] + (ARGV[0] == 'Warframes' ? '' : '_Weapons')).read

regex = source.scan(/<div class="vignette" style="background:url\('((\/[a-zA-Z_]+)+\.png)'\);/)
regex.each do |m|
    path = m[0]
    if path.match('.png')
        img = open('http://warframe-builder.com' + path).read
        File.open('assets/' + ARGV[0].downcase + '/' + path[(path.rindex('/')+1)..path.size], "wb") do |f|
            f.write(img)
        end
    end
end
