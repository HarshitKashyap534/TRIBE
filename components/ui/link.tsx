import type React from "react"
export const Link = ({ href, children, ...props }: { href: string; children: React.ReactNode; [x: string]: any }) => {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}
