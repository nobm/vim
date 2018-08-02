/**
  * vue-imports v0.0.-1
  * (c) 2017 Nobuhiro Kimura
  * @license NYSL
*/

document.addEventListener("DOMContentLoaded", function () {
  document.vue = {}

  function compile(href) {
    let component = {}
    
    const xhr = new XMLHttpRequest()

    xhr.onloadend = function (event) {
      if (this.status == 200) {
        const parser = new DOMParser()
        const doc = parser.parseFromString("<body>" + this.responseText + "</body>", "text/html").body.children

        for (let node of doc) {
          // console.dir(node)
          const type = node.nodeName.toLowerCase()
          const content = node.innerHTML
          

          switch (type) {
            case "script":
              const module = {}
              eval(content)
              component = Object.assign(component, module.exports)
              break;

            case "template":
              component.template = content
              break;

            case "style":
              if(node.hasAttribute("scoped")) {

              } else {
                document.body.appendChild(node)
              }

            default:
              new Error("aaa")
              break;
          }
        }

      }
    }
    xhr.open("GET", href, false) // 非同期！！！
    xhr.send()

    return component
  }

  const links = document.querySelectorAll("link[rel=vue]")
  for (let link of links) {
    const name = link.href.split("/").pop().match("(.+?)\.vue([#\?;].*)?$")[1]
    const compornent = compile(link.href)
    document.vue[name] = compornent
    Vue.component(name, compornent)
  }

  window.vrequire = function(href) {
    return compile(href)
  }

  document.dispatchEvent(new Event('VueImportsLoaded'));

})
