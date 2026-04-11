/** @todo reminder to delete this file */
"use client"

import { Fragment } from "react"
import { Button } from '@/components/ui/button'
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger, ComboboxValue, useComboboxAnchor } from '@/components/ui/combobox'
import { Label } from '@/components/ui/label'
// import MultipleSelector, { type Option } from '@/components/ui/multi-select'



const countries = [
  { code: "", value: "", continent: "", label: "Select country" },
  {
    code: "ar",
    value: "argentina",
    label: "Argentina",
    continent: "South America",
  },
  { code: "au", value: "australia", label: "Australia", continent: "Oceania" },
  { code: "br", value: "brazil", label: "Brazil", continent: "South America" },
  { code: "ca", value: "canada", label: "Canada", continent: "North America" },
  { code: "cn", value: "china", label: "China", continent: "Asia" },
  {
    code: "co",
    value: "colombia",
    label: "Colombia",
    continent: "South America",
  },
  { code: "eg", value: "egypt", label: "Egypt", continent: "Africa" },
  { code: "fr", value: "france", label: "France", continent: "Europe" },
  { code: "de", value: "germany", label: "Germany", continent: "Europe" },
  { code: "it", value: "italy", label: "Italy", continent: "Europe" },
  { code: "jp", value: "japan", label: "Japan", continent: "Asia" },
  { code: "ke", value: "kenya", label: "Kenya", continent: "Africa" },
  { code: "mx", value: "mexico", label: "Mexico", continent: "North America" },
  {
    code: "nz",
    value: "new-zealand",
    label: "New Zealand",
    continent: "Oceania",
  },
  { code: "ng", value: "nigeria", label: "Nigeria", continent: "Africa" },
  {
    code: "za",
    value: "south-africa",
    label: "South Africa",
    continent: "Africa",
  },
  { code: "kr", value: "south-korea", label: "South Korea", continent: "Asia" },
  {
    code: "gb",
    value: "united-kingdom",
    label: "United Kingdom",
    continent: "Europe",
  },
  {
    code: "us",
    value: "united-states",
    label: "United States",
    continent: "North America",
  },
]

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const



const TabItemMetadata = () => {
  const anchor = useComboboxAnchor()

  // const categories: Option[] = [
  //   {
  //     value: 'clothing',
  //     label: 'Clothing'
  //   },
  //   {
  //     value: 'footwear',
  //     label: 'Footwear'
  //   },
  //   {
  //     value: 'accessories',
  //     label: 'Accessories'
  //   },
  //   {
  //     value: 'jewelry',
  //     label: 'Jewelry',
  //     disable: true
  //   },
  //   {
  //     value: 'outerwear',
  //     label: 'Outerwear'
  //   },
  //   {
  //     value: 'fragrance',
  //     label: 'Fragrance'
  //   },
  //   {
  //     value: 'makeup',
  //     label: 'Makeup'
  //   },
  //   {
  //     value: 'skincare',
  //     label: 'Skincare'
  //   },
  //   {
  //     value: 'furniture',
  //     label: 'Furniture'
  //   },
  //   {
  //     value: 'lighting',
  //     label: 'Lighting'
  //   },
  //   {
  //     value: 'kitchenware',
  //     label: 'Kitchenware',
  //     disable: true
  //   },
  //   {
  //     value: 'computers',
  //     label: 'Computers'
  //   },
  //   {
  //     value: 'audio',
  //     label: 'Audio'
  //   },
  //   {
  //     value: 'wearables',
  //     label: 'Wearables'
  //   },
  //   {
  //     value: 'supplements',
  //     label: 'Supplements'
  //   },
  //   {
  //     value: 'sportswear',
  //     label: 'Sportswear'
  //   }
  // ]


  return (
    <div className="flex flex-col items-start gap-6 lg:flex-row">
      <div className="flex w-full flex-1 flex-col gap-6">
        {/* Category */}
        <div>
          <Label>Category</Label>

          <Combobox items={countries} defaultValue={countries[0]}>
            <ComboboxTrigger render={<Button variant="outline" className="w-64 justify-between font-normal"><ComboboxValue /></Button>} />
            <ComboboxContent>
              <ComboboxInput showTrigger={false} placeholder="Search" />
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item.code} value={item}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>
      <div className="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-8 lg:w-1/2">
        <div>
          <Label>Tags</Label>
          <Combobox
            multiple
            autoHighlight
            items={frameworks}
            defaultValue={[frameworks[0]]}
          >
            <ComboboxChips ref={anchor} className="w-full max-w-xs">
              <ComboboxValue>
                {(values) => (
                  <Fragment>
                    {values.map((value: string) => (
                      <ComboboxChip key={value}>{value}</ComboboxChip>
                    ))}
                    <ComboboxChipsInput />
                  </Fragment>
                )}
              </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {/* <MultipleSelector
            commandProps={{
              label: 'Select categories'
            }}
            value={categories.slice(0, 2)}
            defaultOptions={categories}
            placeholder='Select categories'
            hideClearAllButton
            hidePlaceholderWhenSelected
            emptyIndicator={<p className='text-center text-sm'>No results found</p>}
            className='w-full'
          /> */}


        </div>
      </div>
    </div>
  )
}

export default TabItemMetadata