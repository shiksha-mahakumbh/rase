"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminLoading,
  AdminEmpty,
  StatusBadge,
} from "@/components/admin/cms/AdminUi";

type FaqCategory = {
  id: string;
  name: string;
  slug: string;
  locale: string;
  sortOrder: number;
  isActive: boolean;
  _count?: { faqs: number };
};

type Faq = {
  id: string;
  question: string;
  answer: string;
  locale: string;
  status: string;
  isFeatured: boolean;
  sortOrder: number;
  category: { id: string; name: string } | null;
};

const EMPTY_FAQ = {
  question: "",
  answer: "",
  categoryId: "",
  locale: "en",
  isFeatured: false,
  sortOrder: 0,
  status: "draft",
};

export default function FaqAdminPage() {
  const [tab, setTab] = useState<"questions" | "categories">("questions");
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [faqForm, setFaqForm] = useState(EMPTY_FAQ);
  const [catForm, setCatForm] = useState({ name: "", slug: "", locale: "en" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [catData, faqData] = await Promise.all([
        adminCmsFetch<{ items: FaqCategory[] }>("faq/categories?includeInactive=true"),
        adminCmsFetch<{ items: Faq[] }>("faq?limit=100"),
      ]);
      setCategories(catData.items ?? []);
      setFaqs(faqData.items ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load FAQ data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const resetFaqForm = () => {
    setEditingId(null);
    setFaqForm(EMPTY_FAQ);
  };

  const editFaq = (faq: Faq) => {
    setEditingId(faq.id);
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      categoryId: faq.category?.id ?? "",
      locale: faq.locale,
      isFeatured: faq.isFeatured,
      sortOrder: faq.sortOrder,
      status: faq.status,
    });
    setTab("questions");
  };

  const saveFaq = async () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      toast.error("Question and answer are required");
      return;
    }
    try {
      const body = {
        ...faqForm,
        categoryId: faqForm.categoryId || undefined,
      };
      if (editingId) {
        await adminCmsFetch(`faq/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        toast.success("FAQ updated");
      } else {
        await adminCmsFetch("faq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        toast.success("FAQ created");
      }
      resetFaqForm();
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  const removeFaq = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      await adminCmsFetch(`faq/${id}`, { method: "DELETE" });
      toast.success("FAQ deleted");
      if (editingId === id) resetFaqForm();
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const saveCategory = async () => {
    if (!catForm.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      await adminCmsFetch("faq/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(catForm),
      });
      toast.success("Category created");
      setCatForm({ name: "", slug: "", locale: "en" });
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Create failed");
    }
  };

  const removeCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await adminCmsFetch(`faq/categories?id=${id}`, { method: "DELETE" });
      toast.success("Category deleted");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="FAQ Manager"
        description="Manage categories and frequently asked questions for the public site."
      />

      <div className="mb-4 flex gap-2">
        <AdminButton
          variant={tab === "questions" ? "primary" : "secondary"}
          onClick={() => setTab("questions")}
        >
          Questions
        </AdminButton>
        <AdminButton
          variant={tab === "categories" ? "primary" : "secondary"}
          onClick={() => setTab("categories")}
        >
          Categories
        </AdminButton>
      </div>

      {tab === "questions" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <AdminCard>
            <h2 className="mb-4 text-lg font-semibold text-brand-navy">
              {editingId ? "Edit question" : "New question"}
            </h2>
            <div className="space-y-3">
              <AdminInput
                label="Question"
                value={faqForm.question}
                onChange={(e) => setFaqForm((f) => ({ ...f, question: e.target.value }))}
              />
              <AdminTextarea
                label="Answer"
                rows={5}
                value={faqForm.answer}
                onChange={(e) => setFaqForm((f) => ({ ...f, answer: e.target.value }))}
              />
              <AdminSelect
                label="Category"
                value={faqForm.categoryId}
                onChange={(e) => setFaqForm((f) => ({ ...f, categoryId: e.target.value }))}
                options={[
                  { value: "", label: "None" },
                  ...categories.map((c) => ({ value: c.id, label: c.name })),
                ]}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <AdminSelect
                  label="Locale"
                  value={faqForm.locale}
                  onChange={(e) => setFaqForm((f) => ({ ...f, locale: e.target.value }))}
                  options={[
                    { value: "en", label: "English" },
                    { value: "hi", label: "Hindi" },
                  ]}
                />
                <AdminSelect
                  label="Status"
                  value={faqForm.status}
                  onChange={(e) => setFaqForm((f) => ({ ...f, status: e.target.value }))}
                  options={[
                    { value: "draft", label: "Draft" },
                    { value: "published", label: "Published" },
                    { value: "archived", label: "Archived" },
                  ]}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={faqForm.isFeatured}
                  onChange={(e) => setFaqForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                />
                Featured on homepage
              </label>
              <div className="flex gap-2">
                <AdminButton onClick={saveFaq}>
                  {editingId ? "Update" : "Create"}
                </AdminButton>
                {editingId && (
                  <AdminButton variant="secondary" onClick={resetFaqForm}>
                    Cancel
                  </AdminButton>
                )}
              </div>
            </div>
          </AdminCard>

          <div className="space-y-3">
            {faqs.length === 0 ? (
              <AdminEmpty message="No FAQs yet." />
            ) : (
              faqs.map((faq) => (
                <AdminCard key={faq.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-brand-navy">{faq.question}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{faq.answer}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                        <StatusBadge status={faq.status} />
                        <span>{faq.locale}</span>
                        {faq.isFeatured && <span>Featured</span>}
                        {faq.category && <span>{faq.category.name}</span>}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <AdminButton size="sm" variant="secondary" onClick={() => editFaq(faq)}>
                        Edit
                      </AdminButton>
                      <AdminButton size="sm" variant="danger" onClick={() => removeFaq(faq.id)}>
                        Delete
                      </AdminButton>
                    </div>
                  </div>
                </AdminCard>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <AdminCard>
            <h2 className="mb-4 text-lg font-semibold text-brand-navy">New category</h2>
            <div className="space-y-3">
              <AdminInput
                label="Name"
                value={catForm.name}
                onChange={(e) => setCatForm((f) => ({ ...f, name: e.target.value }))}
              />
              <AdminInput
                label="Slug (optional)"
                value={catForm.slug}
                onChange={(e) => setCatForm((f) => ({ ...f, slug: e.target.value }))}
              />
              <AdminSelect
                label="Locale"
                value={catForm.locale}
                onChange={(e) => setCatForm((f) => ({ ...f, locale: e.target.value }))}
                options={[
                  { value: "en", label: "English" },
                  { value: "hi", label: "Hindi" },
                ]}
              />
              <AdminButton onClick={saveCategory}>Create category</AdminButton>
            </div>
          </AdminCard>

          <div className="space-y-3">
            {categories.length === 0 ? (
              <AdminEmpty message="No categories yet." />
            ) : (
              categories.map((cat) => (
                <AdminCard key={cat.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-brand-navy">{cat.name}</p>
                      <p className="text-sm text-slate-500">
                        {cat.slug} · {cat.locale} · {cat._count?.faqs ?? 0} FAQs
                      </p>
                    </div>
                    <AdminButton size="sm" variant="danger" onClick={() => removeCategory(cat.id)}>
                      Delete
                    </AdminButton>
                  </div>
                </AdminCard>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
