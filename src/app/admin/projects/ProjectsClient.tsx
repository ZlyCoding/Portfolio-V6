"use client";

import { useState, useRef } from "react";
import { Toast, useToast, TOAST_KEYFRAMES } from "@/components/Toast";
import {
  getProjectsAndTypes,
  saveProject,
  toggleProjectStatus,
  deleteProject,
  addProjectType,
  deleteProjectType,
  type Project,
  type ProjectDraft,
} from "./actions";
import type { UploadResult } from "@/app/admin/_storage/useImageUpload";

interface UploadControls {
  commitUpload: () => void;
  rollbackUpload: () => Promise<void>;
}
import {
  ProjectSortDropdown,
  ProjectRow,
  ProjectEmptyState,
  TableHeaderActions,
} from "./_components/ProjectComponents";
import {
  ProjectModal,
  ManageTypesModal,
  DeleteModal,
} from "./_modals/ProjectModals";
import { FiSearch, FiAlertCircle, FiRefreshCw } from "react-icons/fi";

// ── Main Client Component ──────────────────────────────────────────────────────
export default function ProjectsClient({
  initialProjects,
  initialProjectTypes,
}: {
  initialProjects: Project[];
  initialProjectTypes: string[];
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [projectTypes, setProjectTypes] =
    useState<string[]>(initialProjectTypes);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const savingRef = useRef(false);
  const deletingRef = useRef(false);
  const { toast, showToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [showManageTypes, setShowManageTypes] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // ── Refresh manual ───────────────────────────────────────────────────────────
  async function refetch() {
    setError(null);
    try {
      const { projects: proj, projectTypes: types } =
        await getProjectsAndTypes();
      setProjects(proj);
      setProjectTypes(types);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  // ── Add type ─────────────────────────────────────────────────────────────────
  async function handleAddType(name: string) {
    if (projectTypes.includes(name)) return;
    const result = await addProjectType(name);
    if (!result.success) {
      showToast("Gagal tambah tipe: " + result.error, "error");
      return;
    }
    setProjectTypes((prev) => [...prev, name].sort());
  }

  // ── Delete type ───────────────────────────────────────────────────────────────
  async function handleDeleteType(name: string) {
    const usedBy = projects.filter((p) => p.type === name);
    if (usedBy.length > 0) {
      showToast(
        `Tipe "${name}" dipakai oleh ${usedBy.length} project, tidak bisa dihapus`,
        "error",
      );
      return;
    }
    const result = await deleteProjectType(name);
    if (!result.success) {
      showToast("Gagal hapus tipe: " + result.error, "error");
      return;
    }
    setProjectTypes((prev) => prev.filter((t) => t !== name));
    showToast(`Tipe "${name}" berhasil dihapus.`, "success");
  }

  // ── Save (create / update) ───────────────────────────────────────────────────
  async function handleSave(
    draft: ProjectDraft,
    uploadFn: (
      currentPath?: string | null,
    ) => Promise<UploadResult | null | undefined>,
    controls: UploadControls,
  ) {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    try {
      let image_url = draft.image_url;
      let image_path = draft.image_path;

      // Step 1: Upload foto (retry-safe — tidak re-upload jika sudah pernah berhasil)
      const uploadResult = await uploadFn(editingProject?.image_path);
      if (uploadResult !== undefined) {
        image_url = uploadResult?.url ?? null;
        image_path = uploadResult?.path ?? null;
      }

      // Step 2: Simpan ke DB
      const payload = { ...draft, image_url, image_path };
      const result = await saveProject(editingProject?.id ?? null, payload);

      if (!result.success) {
        // DB gagal setelah upload berhasil → hapus file orphan dari storage
        await controls.rollbackUpload();
        throw new Error(result.error);
      }

      // Keduanya berhasil → commit (bersihkan state supaya retry tidak re-upload)
      controls.commitUpload();

      showToast(
        editingProject
          ? "Project berhasil diperbarui."
          : "Project berhasil ditambahkan.",
        "success",
      );
      await refetch();
      setShowModal(false);
      setEditingProject(null);
    } catch (err: unknown) {
      showToast(
        "Error: " + (err instanceof Error ? err.message : String(err)),
        "error",
      );
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  // ── Toggle archive ────────────────────────────────────────────────────────────
  async function handleArchive(project: Project) {
    const result = await toggleProjectStatus(project.id, project.status);
    if (!result.success) {
      showToast("Gagal ubah status: " + result.error, "error");
      return;
    }
    const newStatus = project.status === "published" ? "archived" : "published";
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, status: newStatus } : p)),
    );
    showToast(
      newStatus === "archived" ? "Project diarsipkan." : "Project dipublish.",
      "success",
    );
  }

  // ── Delete ────────────────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deletingProject) return;
    if (deletingRef.current) return;
    deletingRef.current = true;
    setDeleting(true);
    try {
      const result = await deleteProject(
        deletingProject.id,
        deletingProject.image_path,
      );
      if (!result.success) throw new Error(result.error);

      setProjects((prev) => prev.filter((p) => p.id !== deletingProject.id));
      setDeletingProject(null);
      showToast("Project berhasil dihapus.", "success");
    } catch (err: unknown) {
      showToast(
        "Gagal hapus: " + (err instanceof Error ? err.message : String(err)),
        "error",
      );
    } finally {
      deletingRef.current = false;
      setDeleting(false);
    }
  }

  // ── Filter & sort ─────────────────────────────────────────────────────────────
  const filtered = projects
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      if (sortBy === "oldest")
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "featured")
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return 0;
    });

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: "100%", maxWidth: "100%" }}>
      {/* Page Header */}
      <div
        style={{
          marginBottom: 28,
          paddingBottom: 24,
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: 6,
          }}
        >
          Projects
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Daftar project yang ditampilkan pada halaman portfolio.
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 18px",
            borderRadius: 10,
            background: "rgba(239,68,68,.08)",
            border: "1px solid rgba(239,68,68,.2)",
            marginBottom: 20,
          }}
        >
          <FiAlertCircle size={16} color="#f87171" />
          <span style={{ fontSize: 13, color: "#f87171", flex: 1 }}>
            {error}
          </span>
          <button
            onClick={refetch}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              borderRadius: 7,
              background: "rgba(239,68,68,.15)",
              border: "1px solid rgba(239,68,68,.25)",
              color: "#f87171",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            <FiRefreshCw size={12} /> Coba lagi
          </button>
        </div>
      )}

      {/* Filters bar */}
      {projects.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 16,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ position: "relative" }}>
            <FiSearch
              size={13}
              color="var(--text-muted)"
              style={{
                position: "absolute",
                left: 11,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
            <input
              className="field"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari project"
              style={{ paddingLeft: 32, width: 200, fontSize: 13 }}
            />
          </div>
          <ProjectSortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      )}

      {/* Table */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                {["Project", "Type", "Status", "Date", "Links"].map((h, i) => (
                  <th
                    key={i}
                    className={i >= 3 ? "col-hide-sm" : ""}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
                <th style={{ padding: "8px 12px", textAlign: "right" }}>
                  <TableHeaderActions
                    show={projects.length > 0}
                    onManageTypes={() => setShowManageTypes(true)}
                    onAdd={() => {
                      setEditingProject(null);
                      setShowModal(true);
                    }}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && projects.length === 0 ? (
                <ProjectEmptyState
                  onAdd={() => {
                    setEditingProject(null);
                    setShowModal(true);
                  }}
                />
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "48px 24px",
                      color: "var(--text-muted)",
                      fontSize: 13,
                    }}
                  >
                    Tidak ada project yang sesuai pencarian.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <ProjectRow
                    key={p.id}
                    project={p}
                    onEdit={() => {
                      setEditingProject(p);
                      setShowModal(true);
                    }}
                    onArchive={() => handleArchive(p)}
                    onDelete={() => setDeletingProject(p)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <ProjectModal
          initial={editingProject ?? undefined}
          projectTypes={projectTypes}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingProject(null);
          }}
          onAddType={handleAddType}
          onDeleteType={handleDeleteType}
          saving={saving}
        />
      )}
      {showManageTypes && (
        <ManageTypesModal
          projectTypes={projectTypes}
          projects={projects}
          onDeleteType={handleDeleteType}
          onClose={() => setShowManageTypes(false)}
        />
      )}
      {deletingProject && (
        <DeleteModal
          project={deletingProject}
          onConfirm={handleDelete}
          onClose={() => setDeletingProject(null)}
          deleting={deleting}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalIn { from { opacity: 0; transform: scale(.95) translateY(10px) } to { opacity: 1; transform: scale(1) translateY(0) } }
        ${TOAST_KEYFRAMES}
        @keyframes spin { to { transform: rotate(360deg) } }
        @media (max-width: 640px) {
          .modal-grid { grid-template-columns: 1fr !important }
          .modal-left { border-right: none !important; border-bottom: 1px solid var(--border-subtle) }
          .col-hide-sm { display: none !important }
          .desc-hide { display: none !important }
        }
      `}</style>
    </div>
  );
}
