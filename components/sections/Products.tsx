import Image from "next/image";
import { STAGGER, STAGGER_DELAY, products } from "@/lib/content";
import { Reveal } from "../Reveal";
import s from "../Sections.module.css";

/**
 * 04 — Programme. A borderless table built from flex rows: index, logo,
 * name + descriptor, description, right-aligned status. Status is carried by
 * colour alone — `Built` in accent, everything unconfirmed in neutral.
 */
export function Products() {
  return (
    <section
      id="act-04"
      className={`${s.section} ${s.sectionInk}`}
      aria-labelledby="products-heading"
    >
      <div className={s.blocks}>
        <div className={s.productsHead}>
          <div className={s.headingGroup}>
            <div className={`mono ${s.eyebrowInk}`}>{products.eyebrow}</div>
            <Reveal
              as="h2"
              id="products-heading"
              name="nits-in"
              className={`h2 ${s.heading}`}
            >
              {products.heading}
            </Reveal>
          </div>
          <div className={`mono ${s.productsCount}`}>{products.count}</div>
        </div>

        <div className={s.productsTable}>
          {products.rows.map((row, i) => (
            <Reveal
              key={row.index}
              name="nits-in-sm"
              range={STAGGER[i]}
              delay={STAGGER_DELAY[i]}
              className={s.productRow}
            >
              <div className={`mono ${s.productIndex}`}>{row.index}</div>

              <Image
                src={row.logo}
                alt={row.name}
                width={208}
                height={88}
                className={s.productLogo}
              />

              <div className={s.productName}>
                <div className="h3">{row.name}</div>
                <div className={`mono ${s.productDescriptor}`}>{row.descriptor}</div>
              </div>

              <div
                className={`body ${s.productDescription}`}
                dangerouslySetInnerHTML={{ __html: row.description }}
              />

              <div className={`mono ${s.productStatus}`} data-status={row.status}>
                {row.statusLabel}
              </div>
            </Reveal>
          ))}
        </div>

        <p className={`mono ${s.note}`}>{products.note}</p>
      </div>
    </section>
  );
}
