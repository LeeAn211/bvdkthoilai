const relationId = (reference: any) => {
  const value = reference?.value
  return value && typeof value === 'object' ? value.id : value
}

export const detachNavigationReference = (collection: string) => async ({ id, req }: any) => {
  try {
    const navigation: any = await req.payload.findGlobal({
      slug: 'navigation',
      depth: 0,
      overrideAccess: true,
      req,
    })

    const matches = (item: any) =>
      item?.linkType === 'reference' &&
      item?.reference?.relationTo === collection &&
      String(relationId(item.reference)) === String(id)

    const original = Array.isArray(navigation?.items) ? navigation.items : []
    const items = original
      .filter((item: any) => !matches(item))
      .map((item: any) => ({
        ...item,
        children: Array.isArray(item.children)
          ? item.children.filter((child: any) => !matches(child))
          : item.children,
      }))

    if (JSON.stringify(items) !== JSON.stringify(original)) {
      await req.payload.updateGlobal({
        slug: 'navigation',
        data: { items },
        depth: 0,
        overrideAccess: true,
        req,
      })
    }
  } catch (error) {
    req.payload.logger.warn({ err: error }, `Không thể tự gỡ liên kết menu tới ${collection}:${id}`)
  }
}
