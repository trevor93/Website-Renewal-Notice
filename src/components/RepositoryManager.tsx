import { useState, useEffect } from 'react';
import { Upload, FolderArchive, FileCode, Trash2, Eye, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Repository {
  id: string;
  client_id: string;
  repository_name: string;
  storage_path: string;
  version: string;
  file_size: number;
  upload_date: string;
  status: 'active' | 'inactive' | 'archived';
  deployment_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Client {
  id: string;
  site_name: string;
  domain_name: string;
}

interface DeploymentLog {
  id: string;
  action: string;
  success: boolean;
  error_message: string | null;
  created_at: string;
  metadata: any;
}

export function RepositoryManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewLogs, setViewLogs] = useState<string | null>(null);
  const [deploymentLogs, setDeploymentLogs] = useState<DeploymentLog[]>([]);

  const [formData, setFormData] = useState({
    repositoryName: '',
    version: '1.0.0',
    deploymentUrl: '',
    notes: '',
  });

  useEffect(() => {
    fetchClients();
    fetchRepositories();
  }, []);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('id, site_name, domain_name')
      .order('site_name');

    if (!error && data) {
      setClients(data);
    }
  };

  const fetchRepositories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('client_repositories')
      .select('*')
      .order('upload_date', { ascending: false });

    if (!error && data) {
      setRepositories(data);
    }
    setLoading(false);
  };

  const fetchDeploymentLogs = async (repositoryId: string) => {
    const { data, error } = await supabase
      .from('repository_deployment_logs')
      .select('*')
      .eq('repository_id', repositoryId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDeploymentLogs(data);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !selectedClient || !formData.repositoryName) {
      alert('Please select a client, provide repository name, and choose a file');
      return;
    }

    setUploading(true);

    try {
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${selectedClient}/${Date.now()}-${formData.repositoryName}.${fileExt}`;
      const filePath = `repositories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('client-repositories')
        .upload(filePath, uploadFile);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('client_repositories')
        .insert({
          client_id: selectedClient,
          repository_name: formData.repositoryName,
          storage_path: filePath,
          version: formData.version,
          file_size: uploadFile.size,
          deployment_url: formData.deploymentUrl || null,
          notes: formData.notes || null,
          status: 'active',
        });

      if (dbError) throw dbError;

      alert('Repository uploaded successfully!');
      setUploadFile(null);
      setFormData({
        repositoryName: '',
        version: '1.0.0',
        deploymentUrl: '',
        notes: '',
      });
      fetchRepositories();
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`Failed to upload repository: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const toggleRepositoryStatus = async (repoId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    const { error } = await supabase
      .from('client_repositories')
      .update({ status: newStatus })
      .eq('id', repoId);

    if (error) {
      alert('Failed to update repository status');
      console.error(error);
    } else {
      fetchRepositories();
    }
  };

  const deleteRepository = async (repoId: string, storagePath: string) => {
    if (!confirm('Are you sure you want to delete this repository? This action cannot be undone.')) {
      return;
    }

    try {
      const { error: storageError } = await supabase.storage
        .from('client-repositories')
        .remove([storagePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('client_repositories')
        .delete()
        .eq('id', repoId);

      if (dbError) throw dbError;

      alert('Repository deleted successfully');
      fetchRepositories();
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(`Failed to delete repository: ${error.message}`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.site_name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Repository Manager</h2>
        <p className="text-gray-400">Upload and manage client website repositories</p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          Upload New Repository
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Select Client *</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
            >
              <option value="">Choose a client...</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.site_name} ({client.domain_name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Repository Name *</label>
            <input
              type="text"
              value={formData.repositoryName}
              onChange={(e) => setFormData({ ...formData, repositoryName: e.target.value })}
              placeholder="e.g., aquabliss-website"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Version</label>
            <input
              type="text"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              placeholder="e.g., 1.0.0"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Deployment URL</label>
            <input
              type="url"
              value={formData.deploymentUrl}
              onChange={(e) => setFormData({ ...formData, deploymentUrl: e.target.value })}
              placeholder="https://..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any additional notes about this repository..."
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-2">Upload Repository ZIP File *</label>
          <div className="flex items-center space-x-3">
            <label className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-400 cursor-pointer hover:border-yellow-500 transition-colors">
              <input
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                className="hidden"
              />
              {uploadFile ? uploadFile.name : 'Choose a ZIP file...'}
            </label>
            {uploadFile && (
              <span className="text-green-400 text-sm">{formatFileSize(uploadFile.size)}</span>
            )}
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading || !uploadFile || !selectedClient}
          className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Upload Repository</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
          <FolderArchive className="w-5 h-5 mr-2" />
          Uploaded Repositories
        </h3>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : repositories.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No repositories uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {repositories.map((repo) => (
              <div key={repo.id} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-white font-semibold text-lg">{repo.repository_name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        repo.status === 'active'
                          ? 'bg-green-900/30 text-green-400 border border-green-700'
                          : 'bg-red-900/30 text-red-400 border border-red-700'
                      }`}>
                        {repo.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Client</p>
                        <p className="text-white">{getClientName(repo.client_id)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Version</p>
                        <p className="text-white">{repo.version}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">File Size</p>
                        <p className="text-white">{formatFileSize(repo.file_size)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Uploaded</p>
                        <p className="text-white">{formatDate(repo.upload_date)}</p>
                      </div>
                    </div>

                    {repo.deployment_url && (
                      <div className="mt-3">
                        <p className="text-gray-400 text-sm">Deployment URL</p>
                        <a
                          href={repo.deployment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-yellow-400 hover:text-yellow-300 text-sm"
                        >
                          {repo.deployment_url}
                        </a>
                      </div>
                    )}

                    {repo.notes && (
                      <div className="mt-3">
                        <p className="text-gray-400 text-sm">Notes</p>
                        <p className="text-gray-300 text-sm">{repo.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => toggleRepositoryStatus(repo.id, repo.status)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        repo.status === 'active'
                          ? 'bg-red-900/30 text-red-400 border border-red-700 hover:bg-red-900/50'
                          : 'bg-green-900/30 text-green-400 border border-green-700 hover:bg-green-900/50'
                      }`}
                    >
                      {repo.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>

                    <button
                      onClick={() => {
                        setViewLogs(repo.id);
                        fetchDeploymentLogs(repo.id);
                      }}
                      className="px-4 py-2 bg-blue-900/30 text-blue-400 border border-blue-700 hover:bg-blue-900/50 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Logs</span>
                    </button>

                    <button
                      onClick={() => deleteRepository(repo.id, repo.storage_path)}
                      className="px-4 py-2 bg-red-900/30 text-red-400 border border-red-700 hover:bg-red-900/50 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {viewLogs && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Deployment Logs
              </h3>
              <button
                onClick={() => setViewLogs(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {deploymentLogs.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No logs available</p>
              ) : (
                <div className="space-y-3">
                  {deploymentLogs.map((log) => (
                    <div key={log.id} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          {log.success ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-400" />
                          )}
                          <div>
                            <p className="text-white font-semibold capitalize">{log.action}</p>
                            <p className="text-gray-400 text-sm">{formatDate(log.created_at)}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          log.success
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-red-900/30 text-red-400'
                        }`}>
                          {log.success ? 'Success' : 'Failed'}
                        </span>
                      </div>

                      {log.error_message && (
                        <div className="mt-3 p-3 bg-red-900/20 border border-red-700 rounded text-sm text-red-400">
                          {log.error_message}
                        </div>
                      )}

                      {log.metadata && (
                        <div className="mt-3 p-3 bg-gray-800 rounded text-sm">
                          <pre className="text-gray-300 overflow-x-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
