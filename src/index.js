window.$docsify = window.$docsify || {};
window.$docsify.plugins = [
  function (hook, vm) {
    hook.afterEach(updateMenuState)
    hook.mounted(function () {
      let tag = function (tagName, parentNode) {
        let node = document.createElement(tagName)
        if (parentNode) parentNode.appendChild(node)
        return node
      }

      let onclick = function (e) {
        e.preventDefault()
        e.target.parentNode.nextSibling.classList.toggle("show")
        e.target.innerText = e.target.innerText == '▶' ? '▼' : '▶'
      }

      let sidebarNav = document.getElementsByClassName("sidebar-nav").item(0)
      let sidebar = tag('div', sidebarNav.parentNode)
      sidebar.id = "treeview"

      createNode = function (parent, item) {
        let li = tag('li', parent)
        let div = tag('div', li)
        let a = [
          tag('a', div),
          tag('a', div),
        ]
        a[0].innerText = item[2]?.length ? '▶' : ''
        a[0].setAttribute("href", "#")
        a[0].classList.add("toggler")
        a[0].onclick = onclick

        a[1].innerText = item[0]
        if (item[1]) {
          a[1].setAttribute("href", `#/${item[1]}`)
          menuItems.push(a[1])
          a[1].onclick = updateMenuState
          a[1].classList.add('menu-item')
        }
        else {
          a[1].classList.add('disabled')
        }
        setNodes(li, item[2])

        return li
      }
      setNodes = function (parent, items) {
        if (items?.length) {
          let ul = tag("ul", parent)
          for (var i = 0; i < items.length; i++) {
            let item = items[i]
            let li = createNode(ul, item)
          }
        }
      }

      fetch("menu.json").then(response => {
        response.json().then(body => {
          setNodes(sidebar, body)
          updateMenuState()
        })
      })
    })
  }
].concat(window.$docsify.plugins || []);