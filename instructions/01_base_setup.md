# Base Setup

## ASK CLI

```bash
npm install -g ask-cli
ask init
```

Select your profile (default)

## Create Project

```bash
ask new
# Please select the runtime Node.js V8
# List of templates you can choose Hello World
# Please type in your skill name:  alexa-iot-traffic-lights
# Skill "alexa-iot-traffic-lights" has been created based on the chosen template
```

## Editor Config [Optional]

Create a file `.editorconfig` and add the following

```bash
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
end_of_line = lf
# editorconfig-tools is unable to ignore longs strings or urls
max_line_length = null
```

## GitIgnore [Optional]

Another thing left out of the ASK template is a `.gitignore`

```bash
node_modules/
```
