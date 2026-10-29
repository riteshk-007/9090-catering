import { getHomeMenuItems, getMenuSettings } from '@/lib/menu-data'
import { MenuCarouselView } from './menu-carousel-view'

/**
 * Home page menu carousel. Dishes come from the database (those the admin ticked "Show on home page"),
 * and the admin can switch the whole section off in the menu settings.
 */
export async function MenuCarousel() {
  const [settings, items] = await Promise.all([getMenuSettings(), getHomeMenuItems(10)])
  if (!settings.carouselEnabled || items.length === 0) return null
  return <MenuCarouselView items={items} settings={settings} />
}
