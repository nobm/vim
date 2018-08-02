/**
  * vue-imports v0.0.0
  * (c) 2017 github.com/nobm
  * @license NYSL
*/

(function () {
  function error(href, mes) {
    console.error(`[VueImports warn]: ${mes}\n---> ${href}`)
  }

  function warn(href, mes) {
    console.warn(`[VueImports warn]: ${mes}\n---> ${href}`)
  }

  window.VueImporter = function (href) {
    let component = {}

    const xhr = new XMLHttpRequest()

    xhr.onloadend = function (event) {
      if (this.status !== 200) {
        components = undefined
        error(href, "Failed to load .vue resource.")
      } else {
        const parser = new DOMParser()
        const doc = parser.parseFromString("<body>" + this.responseText + "</body>", "text/html").body.children

        for (let node of doc) {
          // console.dir(node)
          const type = node.nodeName.toLowerCase()
          const content = node.innerHTML

          if (node.hasAttribute("lang")) {
            warn(href, `Ignored "lang" option of "<${type}>". Pre-Processors is unsupported by VueImports.`)
          }

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
              if (node.hasAttribute("scoped")) {
                warn(href, `Ignored "scoped" option of "<style>". Scoped-CSS is unsupported by VueImports.`)
              }
              if (node.hasAttribute("module")) {
                warn(href, `Ignored "module" option of "<style>". CSS-Modules is unsupported by VueImports.`)
              }
              document.body.appendChild(node)
              break;

            default:
              warn(href, `Ignored "<${type}>". Custom Blocks is unsupported by VueImports.`)
              break;
          }
        }
      }
    }
    xhr.open("GET", href, false) // 非同期！！！
    xhr.send()

    return component
  }

  window.VueImporter.install = function () {

    Vue.mixin({
      beforeCreate: function () {
        //console.log(this.$options.router)
      }
    })

  }

  !window.require && (window.require = window.VueImporter)

  window.VueImporter.linkinit = function() {
    window.document.vue = {}
    const links = document.querySelectorAll("link[rel=vue]")
    for (let link of links) {
      let name = link.getAttribute("name")
      if (!name) {
        name = link.href.split("/").pop().match("(.+?)\.vue([#\?;].*)?$")[1]
      }
      const compornent = VueImporter(link.href)
      document.vue[name] = compornent
      Vue.component(name, compornent)
    }
  }

  window.VueImporter.linkinit()


})()

// document.addEventListener("DOMContentLoaded", function () {
//   window.dispatchEvent(new Event('VueImportsReady'))
// })
