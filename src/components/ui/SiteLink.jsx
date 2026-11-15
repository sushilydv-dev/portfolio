import { navigate } from '@/hooks/usePath'

// <a> that goes to internal pages (/resume, /#work) without a reload. Plain #hashes and
// external URLs behave like normal links. Modifier clicks (open in new tab) are left alone.
function SiteLink({ href, onClick, ref, ...props }) {
  const internal = href.startsWith('/')

  const handleClick = (e) => {
    onClick?.(e)
    if (!internal || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(href)
  }

  return <a ref={ref} href={href} onClick={handleClick} {...props} />
}

export default SiteLink
