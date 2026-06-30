import type { ContentLocale, FaqStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { ServiceError } from "@/server/lib/errors";
import { slugify } from "@/server/lib/cms-utils";
import { revalidatePath } from "next/cache";
import { purgeCmsContentCaches } from "@/server/lib/cms-cache-purge";

function purgeFaqCaches(locale: ContentLocale = "en") {
  revalidatePath("/faq");
  purgeCmsContentCaches({ locales: [locale] });
}

export async function listFaqCategories(options: {
  locale?: ContentLocale;
  includeInactive?: boolean;
}) {
  const where = {
    deletedAt: null,
    ...(options.locale ? { locale: options.locale } : {}),
    ...(options.includeInactive ? {} : { isActive: true }),
  };
  const items = await prisma.faqCategory.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { faqs: { where: { deletedAt: null } } } } },
  });
  return { items };
}

export async function createFaqCategory(input: {
  name: string;
  slug?: string;
  locale?: ContentLocale;
  sortOrder?: number;
  isActive?: boolean;
}) {
  const slug = input.slug ?? slugify(input.name);
  const locale = input.locale ?? "en";
  const existing = await prisma.faqCategory.findFirst({
    where: { slug, locale, deletedAt: null },
  });
  if (existing) throw new ServiceError("Category slug already exists", 409, "SLUG_EXISTS");

  const category = await prisma.faqCategory.create({
    data: {
      name: input.name.trim(),
      slug,
      locale,
      sortOrder: input.sortOrder ?? 0,
      isActive: input.isActive ?? true,
    },
  });

  await writeAuditLog({
    action: "system_event",
    entityType: "faq_categories",
    entityId: category.id,
    payload: { event: "faq_category_created", slug },
  });

  purgeFaqCaches(locale);

  return category;
}

export async function updateFaqCategory(
  id: string,
  input: Partial<{
    name: string;
    slug: string;
    sortOrder: number;
    isActive: boolean;
  }>
) {
  const existing = await prisma.faqCategory.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw new ServiceError("Category not found", 404, "NOT_FOUND");

  const category = await prisma.faqCategory.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    },
  });

  purgeFaqCaches(category.locale);

  return category;
}

export async function deleteFaqCategory(id: string) {
  const existing = await prisma.faqCategory.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw new ServiceError("Category not found", 404, "NOT_FOUND");

  await prisma.faqCategory.update({
    where: { id },
    data: { deletedAt: new Date(), isActive: false },
  });

  purgeFaqCaches(existing.locale);

  return { success: true };
}

export async function listFaqs(options: {
  limit?: number;
  offset?: number;
  status?: FaqStatus;
  locale?: ContentLocale;
  categoryId?: string;
  featured?: boolean;
  includeDeleted?: boolean;
}) {
  const { limit = 25, offset = 0 } = options;
  const where = {
    ...(options.includeDeleted ? {} : { deletedAt: null }),
    ...(options.status ? { status: options.status } : {}),
    ...(options.locale ? { locale: options.locale } : {}),
    ...(options.categoryId ? { categoryId: options.categoryId } : {}),
    ...(options.featured !== undefined ? { isFeatured: options.featured } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.faq.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      take: limit,
      skip: offset,
      include: { category: { select: { id: true, name: true, slug: true } } },
    }),
    prisma.faq.count({ where }),
  ]);

  return { items, total, limit, offset };
}

export async function createFaq(input: {
  question: string;
  answer: string;
  categoryId?: string;
  locale?: ContentLocale;
  isFeatured?: boolean;
  sortOrder?: number;
  status?: FaqStatus;
}) {
  if (!input.question.trim() || !input.answer.trim()) {
    throw new ServiceError("Question and answer are required", 400);
  }

  const faq = await prisma.faq.create({
    data: {
      question: input.question.trim(),
      answer: input.answer.trim(),
      categoryId: input.categoryId ?? null,
      locale: input.locale ?? "en",
      isFeatured: input.isFeatured ?? false,
      sortOrder: input.sortOrder ?? 0,
      status: input.status ?? "draft",
    },
    include: { category: true },
  });

  await writeAuditLog({
    action: "system_event",
    entityType: "faqs",
    entityId: faq.id,
    payload: { event: "faq_created", locale: faq.locale },
  });

  purgeFaqCaches(faq.locale);

  return faq;
}

export async function updateFaq(
  id: string,
  input: Partial<{
    question: string;
    answer: string;
    categoryId: string | null;
    locale: ContentLocale;
    isFeatured: boolean;
    sortOrder: number;
    status: FaqStatus;
  }>
) {
  const existing = await prisma.faq.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw new ServiceError("FAQ not found", 404, "NOT_FOUND");

  const faq = await prisma.faq.update({
    where: { id },
    data: {
      ...(input.question !== undefined ? { question: input.question.trim() } : {}),
      ...(input.answer !== undefined ? { answer: input.answer.trim() } : {}),
      ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
      ...(input.locale !== undefined ? { locale: input.locale } : {}),
      ...(input.isFeatured !== undefined ? { isFeatured: input.isFeatured } : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
    },
    include: { category: true },
  });

  purgeFaqCaches(faq.locale);

  return faq;
}

export async function deleteFaq(id: string) {
  const existing = await prisma.faq.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw new ServiceError("FAQ not found", 404, "NOT_FOUND");

  await prisma.faq.update({
    where: { id },
    data: { deletedAt: new Date(), status: "archived" },
  });

  purgeFaqCaches(existing.locale);

  return { success: true };
}

export async function listPublicFaqs(locale: ContentLocale = "en") {
  const categories = await prisma.faqCategory.findMany({
    where: { deletedAt: null, isActive: true, locale },
    orderBy: { sortOrder: "asc" },
    include: {
      faqs: {
        where: { deletedAt: null, status: "published", locale },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  const featured = await prisma.faq.findMany({
    where: {
      deletedAt: null,
      status: "published",
      locale,
      isFeatured: true,
    },
    orderBy: { sortOrder: "asc" },
    include: { category: { select: { name: true, slug: true } } },
  });

  return { categories, featured };
}
